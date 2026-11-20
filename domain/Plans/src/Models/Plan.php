<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Exceptions\AssignmentPoolTooLarge;
use App\Assignments\Exceptions\AssignmentPoolUnavailable;
use App\Assignments\Models\Support\AssignableListing;
use App\Assignments\Support\AssignmentHolder;
use App\Assignments\Support\OrderedRecordIds;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\Shareable;
use App\Sharing\Support\ShareRecordCard;
use App\Sharing\Support\ShareRelationSet;
use Domain\Plans\Api\PlanCard;
use Domain\Plans\Api\PlanDetails;
use Domain\Plans\Api\PlanPhaseTasks;
use Domain\Plans\Api\PlanProgress;
use Domain\Plans\Api\PlanTextLimits;
use Domain\Plans\Database\Factories\PlanFactory;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Exceptions\StartDenied;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Builder;
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
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[UseFactory(PlanFactory::class)]
#[Fillable(['title', 'brief', 'creator_type', 'creator_id', 'revision', 'type', 'finish_note', 'cancel_reason'])]
final class Plan extends Model implements Assignable, Numbered, ReadableModel, Shareable
{
    /**
     * @use HasFactory<PlanFactory>
     */
    use AssignableListing, HasFactory, HasNumber, HasUlids, Linkable;

    use BoundedReads;

    /**
     * The stable name links and assignments use for a plan.
     */
    public const string LINK_TYPE = 'plans.plan';

    /**
     * The most characters a plan's title or a phase's title holds.
     */
    public const int TITLE_CHARACTERS = PlanTextLimits::TITLE;

    /**
     * The most characters a plan's brief holds.
     */
    public const int BRIEF_CHARACTERS = PlanTextLimits::BRIEF;

    /**
     * The most characters a plan's finish note or cancel reason holds.
     */
    public const int NOTE_CHARACTERS = PlanTextLimits::NOTE;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['state' => 'planned', 'revision' => 1];

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
        ];
    }

    /**
     * A new plan an actor drafts, with its title, brief and type.
     */
    public static function draft(string $title, string $brief, PlanType $type, Actor $creator): self
    {
        return self::query()->create([
            'title' => $title,
            'brief' => $brief,
            'type' => $type,
            'creator_type' => $creator->actorType(),
            'creator_id' => $creator->actorId(),
        ]);
    }

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
    public function finish(string $note): void
    {
        $this->state = PlanState::Done;
        $this->finish_note = $note;
        $this->revision++;
        $this->save();
    }

    /**
     * Ends the plan as cancelled with its reason; its tasks and their assignments stay as they are.
     */
    public function cancel(string $reason): void
    {
        $this->state = PlanState::Cancelled;
        $this->cancel_reason = $reason;
        $this->revision++;
        $this->save();
    }

    /**
     * Whether the plan is being worked: started, and neither finished nor cancelled.
     */
    public function isStarted(): bool
    {
        return $this->state === PlanState::Started;
    }

    /**
     * Starts the plan; true when it changed, false when it was already started. Any other state refuses.
     */
    public function startOnce(): bool
    {
        if ($this->state === PlanState::Started) {
            return false;
        }

        if (! $this->state->canStart()) {
            throw StartDenied::inState($this->state->value);
        }

        $this->state = PlanState::Started;
        $this->save();

        return true;
    }

    /**
     * The phase with this number within the plan; a phase of another plan never answers.
     *
     * @throws PhaseMissing
     */
    public function phaseNumbered(int $number): Phase
    {
        return $this->phases()->where('number', $number)->first()
            ?? throw PhaseMissing::numbered($this->number, $number);
    }

    /**
     * Adds a phase after the last one, inside the caller's transaction.
     */
    public function addPhase(string $title): Phase
    {
        self::lockStructure($this->id);

        return $this->phases()->create(['title' => $title]);
    }

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
     * The card of this plan from the progress of each phase, keyed by the phase's number. The current phase is the
     * first one with unfinished tasks, or the last phase once every task is done; a plan without phases has none.
     *
     * @param  array<int, PlanProgress>  $progressOfPhase
     * @param  Option<AssignmentHolder>  $holder
     * @param  bool  $focused  whether this is the plan the caller's stack works on now
     */
    public function card(array $progressOfPhase, Option $holder, bool $focused): PlanCard
    {
        $progress = array_reduce(
            $progressOfPhase,
            fn (PlanProgress $sum, PlanProgress $phase) => $sum->plus($phase),
            PlanProgress::none(),
        );
        $unfinished = array_keys(array_filter($progressOfPhase, fn (PlanProgress $phase) => ! $phase->isComplete()));
        $currentPhase = $unfinished[0] ?? array_key_last($progressOfPhase);

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

    /**
     * @return HasMany<Phase, $this>
     */
    public function phases(): HasMany
    {
        return $this->hasMany(Phase::class)->orderBy('number');
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
     * A plan is shared as a summary root; the documents and reports linked to it are the owner's to select.
     */
    public static function shareRelations(): ShareRelationSet
    {
        return ShareRelationSet::linked('records', 'share-linked-record');
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
}
