<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Actors\Actor;
use App\Contracts\Assignments\Assignable;
use App\Contracts\Events\EventSource;
use App\Contracts\Projects\ProjectOwned;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Contracts\Sharing\Shareable;
use App\Exceptions\AssignmentPoolTooLarge;
use App\Exceptions\AssignmentPoolUnavailable;
use App\Models\Support\Accessor;
use App\Models\Support\AssignableListing;
use App\Models\Support\BelongsToProject;
use App\Models\Support\JournalModel;
use App\Support\ActorReference;
use App\Support\AssignmentHolder;
use App\Support\OrderedRecordIds;
use App\Support\RecordIdentity;
use App\Support\ShareRecordCard;
use App\Support\ShareRelationSet;
use App\Values\ProjectOwner;
use Carbon\CarbonImmutable;
use Domain\Plans\Database\Factories\PlanFactory;
use Domain\Plans\Enums\PlanReviewStatus;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanTextLimit;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Events\PlanCancelled;
use Domain\Plans\Events\PlanDescribed;
use Domain\Plans\Events\PlanFinished;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Events\PlanReviewDecided;
use Domain\Plans\Events\PlanReviewRequested;
use Domain\Plans\Events\PlanReviewWithdrawn;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Exceptions\PlanUnderReview;
use Domain\Plans\Exceptions\StartDenied;
use Domain\Plans\Values\PlanCard;
use Domain\Plans\Values\PlanDetails;
use Domain\Plans\Values\PlanPhaseTasks;
use Domain\Plans\Values\PlanProgress;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Override;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $project_id
 * @property string $title
 * @property string $brief
 * @property string $creator_type
 * @property string $creator_id
 * @property int $revision
 * @property PlanType $type
 * @property PlanStatus $status
 * @property string|null $finish_note
 * @property string|null $cancel_reason
 * @property int $total_tasks
 * @property int $finished_tasks
 * @property int $cancelled_tasks
 * @property int $blocked_tasks
 * @property int $started_tasks
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Collection<int, Phase> $phases
 * @property-read int|null $phases_count
 * @property-read mixed $progress
 * @property-read mixed $share_card
 * @property-read mixed $share_summary
 *
 * @method static \Domain\Plans\Database\Factories\PlanFactory factory($count = null, $state = [])
 *
 * @mixin \Eloquent
 */
#[UseFactory(PlanFactory::class)]
final class Plan extends JournalModel implements Assignable, EventSource, Numbered, ProjectOwned, ReadableModel, Shareable
{
    use AssignableListing;
    use BelongsToProject;
    use BoundedReads;

    /**
     * @use HasFactory<PlanFactory>
     */
    use HasFactory;

    use HasNumber;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

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
        'status' => 'planned',
        'revision' => 1,
        'total_tasks' => 0,
        'finished_tasks' => 0,
        'cancelled_tasks' => 0,
        'blocked_tasks' => 0,
        'started_tasks' => 0,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => PlanType::class,
            'status' => PlanStatus::class,
            'revision' => 'integer',
            'total_tasks' => 'integer',
            'finished_tasks' => 'integer',
            'cancelled_tasks' => 'integer',
            'blocked_tasks' => 'integer',
            'started_tasks' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new plan an actor drafts, with its title, brief and type.
     */
    public static function create(
        string $title,
        string $brief,
        PlanType $type,
        Actor $creator,
        ProjectOwner $owner,
    ): self {
        $plan = new self();
        $plan->project_id = $owner->projectId();
        $plan->title = $title;
        $plan->brief = $brief;
        $plan->type = $type;
        $plan->creator_type = $creator->actorType();
        $plan->creator_id = $creator->actorId();
        $plan->assertSaved($plan->save());

        return $plan;
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
        $this->raise(new PlanDescribed($this->id, $this->revision));
    }

    /**
     * Ends the plan as done, with the note of what it achieved.
     */
    public function finish(string $note, ActorReference $actor): void
    {
        $this->status = PlanStatus::Done;
        $this->finish_note = $note;
        $this->revision++;
        $this->assertSaved($this->save());
        $this->raise(new PlanFinished($this->id, $actor));
    }

    /**
     * Ends the plan as cancelled with its reason; its tasks and their assignments stay as they are.
     */
    public function cancel(string $reason, ActorReference $actor): void
    {
        $this->status = PlanStatus::Cancelled;
        $this->cancel_reason = $reason;
        $this->revision++;
        $this->assertSaved($this->save());
        $this->raise(new PlanCancelled($this->id, $actor));
    }

    /**
     * Starts the plan for the actor; true when it changed, false when it was already started, which announces nothing.
     * Any other state refuses.
     */
    public function startOnce(ActorReference $actor): bool
    {
        if ($this->status === PlanStatus::Started) {
            return false;
        }

        $this->assertStartable();

        $this->status = PlanStatus::Started;
        $this->assertSaved($this->save());
        $this->raise(new PlanStarted($this->id, $actor));
        $this->recordProgress($this->progress);

        return true;
    }

    /**
     * Puts the planned plan up for review by its reviewers; any other state refuses. The plan holds still until the
     * review ends.
     *
     * @param  list<ActorReference>  $reviewers
     *
     * @throws PlanReviewRefused
     */
    public function requestReview(PlanReviewEdition $review, array $reviewers): void
    {
        $this->assertPlanned();

        $this->status = PlanStatus::Reviewing;
        $this->assertSaved($this->save());
        $this->raise(new PlanReviewRequested($this->id, $review->id, $reviewers, $this->number));
    }

    /**
     * Takes the reviewing plan back to Planned after its review was withdrawn; any other state refuses.
     *
     * @throws PlanReviewRefused
     */
    public function withdrawReview(string $editionId): void
    {
        $this->assertReviewing();

        $this->status = PlanStatus::Planned;
        $this->assertSaved($this->save());
        $this->raise(new PlanReviewWithdrawn($this->id, $editionId));
    }

    /**
     * Takes the reviewing plan back to Planned with its review decided, approved or sent back for changes.
     *
     * @throws PlanReviewRefused
     */
    public function settleReview(string $editionId, PlanReviewStatus $decision): void
    {
        $this->assertReviewing();

        $this->status = PlanStatus::Planned;
        $this->assertSaved($this->save());
        $this->raise(new PlanReviewDecided($this->id, $editionId, $decision));
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

        $this->raise(new PlanProgressChanged(
            $this->id,
            $this->number,
            $this->finished_tasks,
            $this->total_tasks,
            (int) CarbonImmutable::now()->format('Uu'),
        ));
    }

    // ----------[ Predicates ]----------

    /**
     * Whether the plan is being worked: started, and neither finished nor cancelled.
     */
    public function isStarted(): bool
    {
        return $this->status === PlanStatus::Started;
    }

    // ----------[ Transformers ]----------

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
        $this->assertStarted();

        $taskIds = PhaseTask::query()
            ->inPlanOrder($this->id)
            ->readLimit(OrderedRecordIds::LARGEST + 1)
            ->pluck('phase_tasks.task_id')
            ->all();

        $this->assertPoolFits($taskIds);

        return array_map(strval(...), array_values($taskIds));
    }

    /**
     * The card of this plan with its own tallies and its current phase's number, none for a plan without phases.
     *
     * @param  Option<AssignmentHolder>  $holder
     * @param  bool  $isFocused  whether this is the plan the caller's stack works on now
     */
    public function card(int|null $currentPhase, Option $holder, bool $isFocused): PlanCard
    {
        $progress = $this->progress;

        return new PlanCard(
            $this->id,
            $this->number,
            $this->title,
            $this->type,
            $this->status,
            $this->status->canStart(),
            $isFocused,
            $progress,
            $currentPhase,
            $holder,
            $this->projectOwner(),
        );
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return $this->shareIdentity();
    }

    public function shareIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::linkType(), $this->id);
    }

    /**
     * The plan as a read shows it: its card's progress, a window of its phases' tasks and, when the read asks, its
     * long texts.
     *
     * @param  list<PlanPhaseTasks>  $phases
     */
    public function details(PlanCard $card, array $phases, int|null $nextTaskOffset, bool $hasText): PlanDetails
    {
        return new PlanDetails(
            $this->id,
            $this->number,
            $this->title,
            $this->type,
            $this->status,
            $this->revision,
            $this->creator_type,
            $this->creator_id,
            $card->progress,
            $card->currentPhase,
            $phases,
            $nextTaskOffset,
            $hasText ? $this->brief : null,
            $hasText ? $this->finish_note : null,
            $hasText ? $this->cancel_reason : null,
        );
    }

    // ----------[ Accessors ]----------

    /**
     * The plan's safe card for a share: its title. A plan keeps no revisions, so its published version is always 1.
     *
     * @return Attribute<ShareRecordCard, never>
     */
    protected function shareCard(): Attribute
    {
        return Accessor::get(fn () => new ShareRecordCard($this->shareIdentity(), $this->title, '1'));
    }

    /**
     * How far the tasks in the plan's phases have got, from the tallies kept on the row; no task is read.
     *
     * @return Attribute<PlanProgress, never>
     */
    protected function progress(): Attribute
    {
        return Accessor::get(fn () => new PlanProgress(
            $this->finished_tasks,
            $this->cancelled_tasks,
            $this->blocked_tasks,
            $this->started_tasks,
            $this->total_tasks,
        ));
    }

    /**
     * The summary a share shows of the plan: its title and its state, never its phases or tasks.
     *
     * @return Attribute<non-falsy-string, never>
     */
    protected function shareSummary(): Attribute
    {
        return Accessor::get(fn () => <<<TEXT
        # {$this->title}

        This plan is {$this->status->value}.

        TEXT);
    }

    // ----------[ Relations ]----------

    /**
     * @return HasMany<Phase, $this>
     */
    public function phases(): HasMany
    {
        return $this->hasMany(Phase::class)->orderBy('number');
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a start from a state that allows none.
     *
     * @throws StartDenied
     */
    private function assertStartable(): void
    {
        if (! $this->status->canStart()) {
            throw StartDenied::inState($this->number, $this->status->value);
        }
    }

    /**
     * Refuses a review of a plan that is not planned.
     *
     * @throws PlanReviewRefused
     */
    private function assertPlanned(): void
    {
        if ($this->status !== PlanStatus::Planned) {
            throw PlanReviewRefused::notPlanned($this->number, $this->status->value);
        }
    }

    /**
     * Refuses to end a review of a plan that is not under review.
     *
     * @throws PlanReviewRefused
     */
    private function assertReviewing(): void
    {
        if ($this->status !== PlanStatus::Reviewing) {
            throw PlanReviewRefused::notReviewing($this->number, $this->status->value);
        }
    }

    /**
     * Refuses the assignment pool of a plan that has not started.
     *
     * @throws AssignmentPoolUnavailable
     */
    private function assertStarted(): void
    {
        if ($this->status !== PlanStatus::Started) {
            throw AssignmentPoolUnavailable::inState("Plan {$this->number}", $this->status->value);
        }
    }

    /**
     * Refuses a pool larger than an ordered list of ids holds.
     *
     * @param  array<int, mixed>  $taskIds
     *
     * @throws AssignmentPoolTooLarge
     */
    private function assertPoolFits(array $taskIds): void
    {
        if (count($taskIds) > OrderedRecordIds::LARGEST) {
            throw AssignmentPoolTooLarge::holding("Plan {$this->number}", OrderedRecordIds::LARGEST);
        }
    }

    /**
     * Refuses a change to a plan under review.
     *
     * @throws PlanUnderReview
     */
    private function assertNotUnderReview(): void
    {
        if ($this->status === PlanStatus::Reviewing) {
            throw PlanUnderReview::forPlan($this->number);
        }
    }

    // ----------[ Queries ]----------

    /**
     * Locks a plan's row for update, so its phases and their tasks hold still until the transaction ends. Every change
     * of a plan's membership and every cascade over it takes this lock first; a future move between plans takes both
     * plans' locks in id order.
     */
    public static function findLockedStructure(string $planId): self
    {
        return self::findLockedById($planId);
    }

    /**
     * Locks the plan as lockStructure does for a change of its content, its phases or its tasks, which a plan under
     * review refuses.
     *
     * @throws PlanUnderReview
     */
    public static function findLockedForChange(string $planId): self
    {
        $plan = self::findLockedStructure($planId);
        $plan->assertNotUnderReview();

        return $plan;
    }

    /**
     * A plan is shared as a summary root; the documents and reports linked to it are the owner's to select.
     */
    #[Override]
    public static function shareRelations(): ShareRelationSet
    {
        return ShareRelationSet::linked('records', 'share-linked-record');
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

    /**
     * The rows of the given title.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withTitle(Builder $query, string $title): void
    {
        $query->where('title', $title);
    }

    /**
     * The rows of the given number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withNumber(Builder $query, mixed $number): void
    {
        $query->where('number', $number);
    }
}
