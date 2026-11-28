<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Assignments\Contracts\Assignable;
use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Exceptions\RecordUnavailable;
use App\Models\Support\Accessor;
use App\Models\Support\ProjectMembership;
use App\Models\Support\JournalModel;
use App\Projects\Contracts\ProjectOwned;
use App\Records\Contracts\Numbered;
use App\Records\Contracts\ReadableModel;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Plans\Events\PhaseProgressRecorded;
use Domain\Plans\Events\PhaseRevisionAdvanced;
use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Exceptions\PhaseRevisionChanged;
use Domain\Plans\Values\PhaseDetails;
use Domain\Plans\Values\PlanPhaseTasks;
use Domain\Plans\Values\PlanProgress;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $plan_id
 * @property string $project_id
 * @property string $number_group_id
 * @property int $number
 * @property string $title
 * @property int $revision
 * @property int $total_tasks
 * @property int $finished_tasks
 * @property int $cancelled_tasks
 * @property int $blocked_tasks
 * @property int $started_tasks
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Plan $plan
 * @property-read mixed $progress
 *
 * @mixin \Eloquent
 */
final class Phase extends JournalModel implements Assignable, EventSource, Numbered, ProjectOwned, ReadableModel
{
    use ProjectMembership;
    use BoundedReads;
    use HasNumber;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
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
            'number' => 'integer',
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
     * The plan's next phase, numbered within it.
     */
    public static function create(Plan $plan, string $title): self
    {
        $phase = new self();
        $phase->title = $title;
        $phase->plan_id = $plan->id;
        $phase->project_id = $plan->project_id;
        $phase->setRelation('plan', $plan);
        $phase->save();

        return $phase;
    }

    // ----------[ Mutations ]----------

    /**
     * The phase took new tasks: it moves to its next revision.
     */
    public function advanceRevision(): void
    {
        $this->revision++;
        $this->saveAndAssert();
        $this->raise(new PhaseRevisionAdvanced($this->plan_id, $this->id));
    }

    /**
     * Keeps the tallies of the phase's tasks, changed in the transaction that placed or moved one of them.
     */
    public function recordProgress(PlanProgress $progress): void
    {
        $this->total_tasks = $progress->total;
        $this->finished_tasks = $progress->finished;
        $this->cancelled_tasks = $progress->cancelled;
        $this->blocked_tasks = $progress->blocked;
        $this->started_tasks = $progress->started;
        $this->saveAndAssert();
        $this->raise(new PhaseProgressRecorded($this->plan_id, $this->id));
    }

    // ----------[ Transformers ]----------

    /**
     * @return list<string>
     */
    public function taskIds(): array
    {
        return array_map(
            strval(...),
            array_values(
                PhaseTask::query()->ofPhase($this->id)->inPositionOrder()
                    ->pluck('task_id')->all(),
            ),
        );
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::linkType(), $this->id);
    }

    /**
     * A phase is numbered within its plan: plan 12's phase 2.
     */
    public function numberHolder(): Model
    {
        if ($this->relationLoaded('plan')) {
            return $this->plan;
        }

        return $this->plan()->sole();
    }

    /**
     * The phase in a plan read, with the window of its tasks that read shows.
     *
     * @param  list<string>  $ids
     */
    public function withTasks(array $ids): PlanPhaseTasks
    {
        return new PlanPhaseTasks($this->id, $this->number, $this->title, $this->revision, $ids);
    }

    /**
     * The phase as a read shows it, with every task in its order.
     */
    public function details(): PhaseDetails
    {
        return new PhaseDetails(
            $this->id,
            $this->plan_id,
            $this->number,
            $this->title,
            $this->revision,
            $this->taskIds(),
        );
    }

    // ----------[ Accessors ]----------

    /**
     * How far the tasks placed in it have got, from the tallies kept on the row; no task is read.
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

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Plan, $this>
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a change made against a revision of the phase that is no longer current.
     *
     * @throws PhaseRevisionChanged
     */
    public function assertAtRevision(int $expectedRevision): void
    {
        if ($this->revision !== $expectedRevision) {
            throw PhaseRevisionChanged::for($this->number, $expectedRevision, $this->revision);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The phase with this number within the plan; a phase of another plan never answers.
     *
     * @throws PhaseMissing
     */
    public static function findNumberedIn(Plan $plan, int $number): self
    {
        return $plan
            ->phases()
            ->numbered($number)
            ->firstOr(PhaseMissing::throwing()->numbered($plan->number, $number));
    }

    /**
     * The phase with this number in the plan, counted within the plan; none is refused as unavailable.
     *
     * @throws RecordUnavailable
     */
    public static function findNumberedInPlanId(string $planId, int $number): self
    {
        return self::query()
            ->ofPlan($planId)
            ->numbered($number)
            ->firstOr(RecordUnavailable::throwing()->numbered('phase', $number));
    }

    /**
     * The current phase's number of each plan that has phases, read from the phase tallies in one grouped query: the
     * first phase with fewer finished tasks than tasks, else the last; zero of zero counts as complete.
     *
     * @param  list<string>  $planIds
     * @return array<string, int>
     */
    public static function resolveCurrentNumbersOf(array $planIds): array
    {
        return self::query()->ofPlans($planIds)
            ->selectRaw(
                'plan_id, coalesce(min(case when finished_tasks < total_tasks then number end), max(number)) as current',
            )
            ->perPlan()
            ->pluck('current', 'plan_id')
            ->map(fn (mixed $number) => (int) $number)
            ->all();
    }

    /**
     * At most limit of the plan's phases after the phase numbered after, in the plan's order, with their tallies.
     *
     * @return EloquentCollection<int, self>
     */
    public static function findHeadingsIn(string $planId, int $after, int $limit): EloquentCollection
    {
        return self::query()->ofPlan($planId)->numberedAfter($after)->inNumberOrder()->limit($limit)->get();
    }

    // ----------[ Scopes ]----------

    /**
     * The phase that holds the task, if any.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function holdingTask(Builder $query, string $taskId): void
    {
        $query->whereIn('id', PhaseTask::query()->phaseIds()->ofTask($taskId));
    }

    /**
     * The plan's phases.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofPlan(Builder $query, string $planId): void
    {
        $query->where('plan_id', $planId);
    }

    /**
     * The phases of the plans.
     *
     * @param  Builder<self>  $query
     * @param  array<int, int|string>  $ids
     */
    #[Scope]
    protected function ofPlans(Builder $query, array $ids): void
    {
        $query->whereIn('plan_id', $ids);
    }

    /**
     * The phase of that number within its plan.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function numbered(Builder $query, int $number): void
    {
        $query->where('number', $number);
    }

    /**
     * The phases numbered after that number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function numberedAfter(Builder $query, int $number): void
    {
        $query->where('number', '>', $number);
    }

    /**
     * The phases in the order of their number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inNumberOrder(Builder $query): void
    {
        $query->orderBy('number');
    }

    /**
     * One group of rows for each plan.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function perPlan(Builder $query): void
    {
        $query->groupBy('plan_id');
    }

    /**
     * The rows by number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byNumber(Builder $query): void
    {
        $query->orderBy('number');
    }

    /**
     * The rows with their plan loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withPlan(Builder $query): void
    {
        $query->with('plan');
    }

    /**
     * The phases numbered after the given number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function afterNumber(Builder $query, int $number): void
    {
        $query->where('number', '>', $number);
    }
}
