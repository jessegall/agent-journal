<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Exceptions\AssignmentPoolTooLarge;
use App\Assignments\Exceptions\AssignmentPoolUnavailable;
use App\Assignments\Models\Support\AssignableListing;
use App\Assignments\Support\AssignmentHolder;
use App\Assignments\Support\OrderedRecordIds;
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\Shareable;
use App\Sharing\Support\ShareRecordCard;
use App\Sharing\Support\ShareRelationSet;
use Domain\Plans\Api\Events\PlanCancelled;
use Domain\Plans\Api\Events\PlanFinished;
use Domain\Plans\Api\Events\PlanStarted;
use Domain\Plans\Api\PlanCard;
use Domain\Plans\Api\PlanDetails;
use Domain\Plans\Api\PlanPhaseTasks;
use Domain\Plans\Api\PlanProgress;
use Domain\Plans\Database\Factories\PlanFactory;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanTextLimit;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Exceptions\StartDenied;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * A goal with phases in order and the tasks in each phase. Every agent and the owner read every plan, so it has no
 * agent limit (rule 4, message 519).
 *
 * @property string $id
 * @property string $title
 * @property string $brief
 * @property ActorType $creator_type
 * @property string $creator_id
 * @property int $revision
 * @property PlanType $type
 * @property string|null $finish_note
 * @property string|null $cancel_reason
 * @property PlanState $state
 * @property int $total_tasks
 * @property int $finished_tasks
 * @property int $cancelled_tasks
 * @property int $blocked_tasks
 * @property int $started_tasks
 * @property-read PlanProgress $progress
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[UseFactory(PlanFactory::class)]
#[Fillable(['title', 'brief', 'creator_type', 'creator_id', 'revision', 'type', 'finish_note', 'cancel_reason'])]
final class Plan extends Model implements Assignable, EventSource, Numbered, ReadableModel, Shareable
{
    use AssignableListing;
    use BoundedReads;

    /**
     * @use HasFactory<PlanFactory>
     */
    use HasFactory;

    use HasNumber;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * The stable name links and assignments use for a plan.
     */
    public const string LINK_TYPE = 'plans.plan';

    /**
     * The most characters a plan's title or a phase's title holds.
     */
    public const int TITLE_CHARACTER_LIMIT = PlanTextLimit::Title->value;

    /**
     * The most characters a plan's brief holds.
     */
    public const int BRIEF_CHARACTER_LIMIT = PlanTextLimit::Brief->value;

    /**
     * The most characters a plan's finish note or cancel reason holds.
     */
    public const int NOTE_CHARACTER_LIMIT = PlanTextLimit::Note->value;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'state' => 'planned',
        'revision' => 1,
        'total_tasks' => 0,
        'finished_tasks' => 0,
        'cancelled_tasks' => 0,
        'blocked_tasks' => 0,
        'started_tasks' => 0,
    ];

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => PlanType::class,
            'state' => PlanState::class,
            'creator_type' => ActorType::class,
            'revision' => 'integer',
            'total_tasks' => 'integer',
            'finished_tasks' => 'integer',
            'cancelled_tasks' => 'integer',
            'blocked_tasks' => 'integer',
            'started_tasks' => 'integer',
        ];
    }

    /**
     * A new plan an actor drafts, with its title, brief and type.
     */
    public static function create(string $title, string $brief, PlanType $type, Actor $creator): self
    {
        return self::query()->create([
            'title' => $title,
            'brief' => $brief,
            'type' => $type,
            'creator_type' => $creator->actorType(),
            'creator_id' => $creator->actorId(),
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * Locks a plan's row for update, so its phases and their tasks hold still until the transaction ends. Every change
     * of a plan's membership and every cascade over it takes this lock first; a future move between plans takes both
     * plans' locks in id order.
     */
    public static function lockStructure(string $planId): self
    {
        return self::query()->whereKey($planId)->lockForUpdate()->firstOrFail();
    }

    /**
     * A plan is shared as a summary root; the documents and reports linked to it are the owner's to select.
     */
    public static function shareRelations(): ShareRelationSet
    {
        return ShareRelationSet::linked('records', 'share-linked-record');
    }

    // ----------[ Mutations ]----------

    /**
     * Gives the plan a new title, brief and type, as a new revision.
     */
    public function describe(string $title, string $brief, PlanType $type): void
    {
        $this->title = $title;
        $this->brief = $brief;
        $this->type = $type;
        $this->revision++;
        $this->save();
    }

    /**
     * Ends the plan as done, with the note of what it achieved.
     */
    public function finish(string $note, ActorContext $actor): void
    {
        $this->state = PlanState::Done;
        $this->finish_note = $note;
        $this->revision++;
        $this->assertSaved($this->save());
        $this->raise(new PlanFinished($this->id, $actor));
    }

    /**
     * Ends the plan as cancelled with its reason; its tasks and their assignments stay as they are.
     */
    public function cancel(string $reason, ActorContext $actor): void
    {
        $this->state = PlanState::Cancelled;
        $this->cancel_reason = $reason;
        $this->revision++;
        $this->assertSaved($this->save());
        $this->raise(new PlanCancelled($this->id, $actor));
    }

    /**
     * Starts the plan for the actor; true when it changed, false when it was already started, which announces nothing.
     * Any other state refuses.
     */
    public function startOnce(ActorContext $actor): bool
    {
        if ($this->state === PlanState::Started) {
            return false;
        }

        if (! $this->state->canStart()) {
            throw StartDenied::inState($this->number, $this->state->value);
        }

        $this->state = PlanState::Started;
        $this->assertSaved($this->save());
        $this->raise(new PlanStarted($this->id, $actor));

        return true;
    }

    /**
     * Keeps the tallies of the tasks in the plan's phases, changed in the transaction that placed or moved one of them.
     */
    public function recordProgress(PlanProgress $progress): void
    {
        $this->total_tasks = $progress->total;
        $this->finished_tasks = $progress->finished;
        $this->cancelled_tasks = $progress->cancelled;
        $this->blocked_tasks = $progress->blocked;
        $this->started_tasks = $progress->started;
        $this->assertSaved($this->save());
    }

    // ----------[ Answers ]----------

    /**
     * How far the tasks in the plan's phases have got, from the tallies kept on the row; no task is read.
     *
     * @return Attribute<PlanProgress, never>
     */
    protected function progress(): Attribute
    {
        return Attribute::get(fn () => new PlanProgress(
            $this->finished_tasks,
            $this->cancelled_tasks,
            $this->blocked_tasks,
            $this->started_tasks,
            $this->total_tasks,
        ));
    }

    /**
     * Whether the plan is being worked: started, and neither finished nor cancelled.
     */
    public function isStarted(): bool
    {
        return $this->state === PlanState::Started;
    }

    /**
     * The phase with this number within the plan; a phase of another plan never answers.
     *
     * @throws PhaseMissing
     */
    public function phaseNumbered(int $number): Phase
    {
        return $this->phases()->where('number', $number)->firstOr(
            fn () => throw PhaseMissing::numbered($this->number, $number),
        );
    }

    /**
     * Every task of the plan, phase by phase, in order.
     *
     * @return list<string>
     */
    public function taskIds(): array
    {
        $taskIds = PhaseTask::query()
            ->inPlanOrder($this->id)
            ->readAll('assignment and progress of a plan cover every task')
            ->pluck('phase_tasks.task_id')
            ->all();

        return array_map(strval(...), array_values($taskIds));
    }

    /**
     * The tasks auto-assignment may give out from this plan, phase by phase, in order: only while it is started, and
     * never a first part of a plan larger than one pool may list.
     *
     * @return list<string>
     *
     * @throws AssignmentPoolUnavailable
     * @throws AssignmentPoolTooLarge
     */
    public function poolTaskIds(): array
    {
        if ($this->state !== PlanState::Started) {
            throw AssignmentPoolUnavailable::inState("Plan {$this->number}", $this->state->value);
        }

        $taskIds = PhaseTask::query()
            ->inPlanOrder($this->id)
            ->readLimit(OrderedRecordIds::LARGEST + 1)
            ->pluck('phase_tasks.task_id')
            ->all();

        if (count($taskIds) > OrderedRecordIds::LARGEST) {
            throw AssignmentPoolTooLarge::holding("Plan {$this->number}", OrderedRecordIds::LARGEST);
        }

        return array_map(strval(...), array_values($taskIds));
    }

    /**
     * The card of this plan with its own tallies and the progress of each phase, keyed by the phase's number in order,
     * from which PlanProgress picks the current phase.
     *
     * @param  array<int, PlanProgress>  $progressOfPhase
     * @param  Option<AssignmentHolder>  $holder
     * @param  bool  $focused  whether this is the plan the caller's stack works on now
     */
    public function card(array $progressOfPhase, Option $holder, bool $focused): PlanCard
    {
        $progress = $this->progress;
        $currentPhase = PlanProgress::currentPhaseOf($progressOfPhase);

        return new PlanCard(
            $this->id,
            $this->number,
            $this->title,
            $this->type,
            $this->state,
            $this->state->canStart(),
            $focused,
            $progress,
            $currentPhase,
            $holder,
        );
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return $this->shareIdentity();
    }

    public function shareIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    /**
     * The plan's safe card for a share: its title. A plan keeps no revisions, so its published version is always 1.
     */
    public function shareCard(): ShareRecordCard
    {
        return new ShareRecordCard($this->shareIdentity(), $this->title, '1');
    }

    /**
     * The summary a share shows of the plan: its title and its state, never its phases or tasks.
     */
    public function shareSummary(): string
    {
        return <<<TEXT
        # {$this->title}

        This plan is {$this->state->value}.

        TEXT;
    }

    /**
     * The plan as a read shows it: its card's progress, a window of its phases' tasks and, when the read asks, its
     * long texts.
     *
     * @param  list<PlanPhaseTasks>  $phases
     */
    public function details(PlanCard $card, array $phases, int|null $nextTaskOffset, bool $withText): PlanDetails
    {
        return new PlanDetails(
            $this->id,
            $this->number,
            $this->title,
            $this->type,
            $this->state,
            $this->revision,
            $this->creator_type,
            $this->creator_id,
            $card->progress,
            $card->currentPhase,
            $phases,
            $nextTaskOffset,
            $withText ? $this->brief : null,
            $withText ? $this->finish_note : null,
            $withText ? $this->cancel_reason : null,
        );
    }

    // ----------[ Relations ]----------

    /**
     * @return HasMany<Phase, $this>
     */
    public function phases(): HasMany
    {
        return $this->hasMany(Phase::class)->orderBy('number');
    }

    // ----------[ Scopes ]----------

    /**
     * The caller's current plan first when it has one, then the newest.
     *
     * @param  Builder<self>  $query
     * @param  Option<string>  $focusedPlanId
     */
    #[Scope]
    protected function listOrder(Builder $query, Option $focusedPlanId): void
    {
        $focusedPlanId->forAll(
            fn (string $id) => $query->orderByRaw('case when "plans"."id" = ? then 0 else 1 end', [$id]),
        );

        $query->orderByDesc('id');
    }
}
