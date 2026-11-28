<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Models\Support\HasUlidKey;
use App\Records\Concerns\CountsPivotLoads;
use App\Records\Contracts\ReadableModel;
use App\Records\Values\ReadOrder;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * @property string $id
 * @property string $phase_id
 * @property string $task_id
 * @property int $position
 *
 * @mixin \Eloquent
 */
#[Table('phase_tasks')]
final class PhaseTask extends Pivot implements ReadableModel
{
    use BoundedReads;
    use CountsPivotLoads;
    use HasUlidKey;
    use Linkable;

    public $timestamps = false;

    /**
     * A pivot opens every attribute by default; this one stays closed, as every model writes its columns as properties.
     *
     * @var list<string>
     */
    protected $guarded = ['*'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['position' => 'integer'];
    }

    // ----------[ Constructors ]----------

    /**
     * The task placed in the phase at this position.
     */
    public static function create(Phase $phase, string $taskId, int $position): self
    {
        $phaseTask = new self();
        $phaseTask->phase_id = $phase->id;
        $phaseTask->task_id = $taskId;
        $phaseTask->position = $position;
        $phaseTask->save();

        return $phaseTask;
    }

    // ----------[ Transformers ]----------

    /**
     * The places of a phase in their order; the table has no created_at.
     */
    public function defaultReadOrder(): ReadOrder
    {
        return ReadOrder::by(['phase_tasks.phase_id', 'phase_tasks.position'], 'phase_tasks.id');
    }

    // ----------[ Queries ]----------

    /**
     * The number of the phase each task of the plan is in, by task id, read once for the whole plan.
     *
     * @return array<string, int>
     */
    public static function resolvePhaseNumbersInPlan(string $planId): array
    {
        return array_map(intval(...), self::query()
            ->inPlanOrder($planId)
            ->pluck('phases.number', 'phase_tasks.task_id')
            ->all());
    }

    /**
     * The task ids of each of the phases, each phase's in its order, read in one query and keyed by phase id.
     *
     * @param  list<string>  $phaseIds
     * @return array<string, list<string>>
     */
    public static function resolveTaskIdsByPhase(array $phaseIds): array
    {
        $taskIds = array_fill_keys($phaseIds, []);

        $phaseTasks = self::query()
            ->ofPhases($phaseIds)
            ->inPositionOrder()
            ->get(['phase_id', 'task_id']);

        foreach ($phaseTasks as $phaseTask) {
            $taskIds[$phaseTask->phase_id][] = (string) $phaseTask->task_id;
        }

        return $taskIds;
    }

    /**
     * At most limit task ids of the phase placed after the position, in the phase's order, keyed by position; the
     * phase's other places are never read.
     *
     * @return array<int, string>
     */
    public static function resolvePageOf(string $phaseId, int $afterPosition, int $limit): array
    {
        return self::query()->ofPhase($phaseId)->placedAfter($afterPosition)->inPositionOrder()->limit($limit)
            ->pluck('task_id', 'position')
            ->map(fn (mixed $taskId) => (string) $taskId)
            ->all();
    }

    // ----------[ Scopes ]----------

    /**
     * The places of one plan's tasks, phase by phase and in each phase's order, the place's id last.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inPlanOrder(Builder $query, string $planId): void
    {
        $query->join('phases', 'phases.id', '=', 'phase_tasks.phase_id')
            ->where('phases.plan_id', $planId)
            ->orderBy('phases.number')
            ->orderBy('phase_tasks.position')
            ->orderBy('phase_tasks.id');
    }

    /**
     * The phase's tasks.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofPhase(Builder $query, string $phaseId): void
    {
        $query->where('phase_id', $phaseId);
    }

    /**
     * The tasks in the order of their place in the phase, then of their id.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inPositionOrder(Builder $query): void
    {
        $query->orderBy('position')->orderBy('task_id');
    }

    /**
     * The tasks of the phases.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function ofPhases(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('phase_id', $ids);
    }

    /**
     * The tasks placed after that position.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function placedAfter(Builder $query, int $position): void
    {
        $query->where('position', '>', $position);
    }

    /**
     * The rows of the given task.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofTask(Builder $query, string $taskId): void
    {
        $query->where('task_id', $taskId);
    }

    /**
     * The rows of any of the given tasks.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function ofTasks(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('task_id', $ids);
    }

    /**
     * The rows by phase id, then position.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byPhaseIdThenPosition(Builder $query): void
    {
        $query->orderBy('phase_id');
        $query->orderBy('position');
    }

    /**
     * The rows by position.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byPosition(Builder $query): void
    {
        $query->orderBy('position');
    }

    /**
     * Only the phase of each row, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function phaseIds(Builder $query): void
    {
        $query->select('phase_id');
    }
}
