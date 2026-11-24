<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Assignments\Assignable;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\RecordUnavailable;
use App\Support\RecordIdentity;
use Domain\Plans\Events\PhaseProgressRecorded;
use Domain\Plans\Events\PhaseRevisionAdvanced;
use Domain\Plans\Exceptions\PhaseRevisionChanged;
use Domain\Plans\Values\PhaseDetails;
use Domain\Plans\Values\PlanPhaseTasks;
use Domain\Plans\Values\PlanProgress;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One phase of a plan, at its place in the plan, holding tasks in order. A task sits in one phase at most.
 *
 * @property string $id
 * @property string $plan_id
 * @property string $title
 * @property string $number_group_id
 * @property int $number
 * @property int $revision
 * @property int $total_tasks
 * @property int $finished_tasks
 * @property int $cancelled_tasks
 * @property int $blocked_tasks
 * @property int $started_tasks
 * @property-read PlanProgress $progress
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['title', 'revision'])]
final class Phase extends Model implements Assignable, EventSource, Numbered, ReadableModel
{
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * The stable name links and assignments use for a phase.
     */
    public const string LINK_TYPE = 'plans.phase';

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

    // ----------[ Constructors ]----------

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

    /**
     * The plan's next phase, numbered within it.
     */
    public static function create(Plan $plan, string $title): self
    {
        $phase = new self(['title' => $title]);
        $phase->plan_id = $plan->id;
        $phase->setRelation('plan', $plan);
        $phase->save();

        return $phase;
    }

    // ----------[ Queries ]----------

    /**
     * The phase with this number in the plan, counted within the plan; none is refused as unavailable.
     *
     * @throws RecordUnavailable
     */
    public static function numberedIn(string $planId, int $number): self
    {
        return self::query()->where('plan_id', $planId)->where('number', $number)->firstOr(
            fn () => throw RecordUnavailable::numbered('phase', $number),
        );
    }

    /**
     * The current phase's number of each plan that has phases, read from the phase tallies in one grouped query: the
     * first phase with fewer finished tasks than tasks, else the last; zero of zero counts as complete.
     *
     * @param  list<string>  $planIds
     * @return array<string, int>
     */
    public static function currentNumbersOf(array $planIds): array
    {
        return self::query()->whereIn('plan_id', $planIds)
            ->selectRaw(
                'plan_id, coalesce(min(case when finished_tasks < total_tasks then number end), max(number)) as current',
            )
            ->groupBy('plan_id')
            ->readAll('one row of each listed plan')
            ->pluck('current', 'plan_id')
            ->map(fn (mixed $number) => (int) $number)
            ->all();
    }

    /**
     * At most limit of the plan's phases after the phase numbered after, in the plan's order, with their tallies.
     *
     * @return EloquentCollection<int, self>
     */
    public static function headingsIn(string $planId, int $after, int $limit): EloquentCollection
    {
        return self::query()->where('plan_id', $planId)->where('number', '>', $after)
            ->orderBy('number')->orderBy('id')->readUpTo($limit)->get();
    }

    // ----------[ Mutations ]----------

    /**
     * The phase took new tasks: it moves to its next revision.
     */
    public function advanceRevision(): void
    {
        $this->revision++;
        $this->assertSaved($this->save());
        $this->raise(new PhaseRevisionAdvanced($this->id));
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
        $this->assertSaved($this->save());
        $this->raise(new PhaseProgressRecorded($this->id));
    }

    // ----------[ Answers ]----------

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

    /**
     * @return list<string>
     */
    public function taskIds(): array
    {
        return array_map(
            strval(...),
            array_values(
                PhaseTask::query()->where(
                    'phase_id',
                    $this->id,
                )->readAll('every task of the phase')->orderBy('position')->pluck('task_id')->all(),
            ),
        );
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    /**
     * A phase is numbered within its plan: plan 12's phase 2.
     */
    public function numberHolder(): Model
    {
        return $this->relationLoaded('plan') ? $this->plan : $this->plan()->sole();
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
        return Attribute::get(fn () => new PlanProgress(
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

    // ----------[ Scopes ]----------

    /**
     * The phase that holds the task, if any.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function holdingTask(Builder $query, string $taskId): void
    {
        $query->whereIn('id', PhaseTask::query()->select('phase_id')->where('task_id', $taskId));
    }
}
