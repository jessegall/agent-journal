<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Concerns\BoundedReads;
use App\Concerns\CountsPivotLoads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Values\ReadOrder;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * A task's place in a phase. It keeps the task id only; the task itself stays in Tasks.
 *
 * @property string $id
 * @property string $phase_id
 * @property string $task_id
 * @property int $position
 */
#[Table('phase_tasks')]
#[Fillable(['phase_id', 'task_id', 'position'])]
final class PhaseTask extends Pivot implements ReadableModel
{
    use BoundedReads;
    use CountsPivotLoads;
    use HasUlids;
    use Linkable;

    public $timestamps = false;

    /**
     * A pivot opens every attribute by default; this one takes only its Fillable list.
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

    // ----------[ Getters ]----------

    /**
     * The places of a phase in their order; the table has no created_at.
     */
    public function defaultReadOrder(): ReadOrder
    {
        return ReadOrder::by(['phase_tasks.phase_id', 'phase_tasks.position'], 'phase_tasks.id');
    }

    /**
     * The number of the phase each task of the plan is in, by task id, read once for the whole plan.
     *
     * @return array<string, int>
     */
    public static function phaseNumbersInPlan(string $planId): array
    {
        return array_map(intval(...), self::query()
            ->inPlanOrder($planId)
            ->readAll('the phase of every task of one plan')
            ->pluck('phases.number', 'phase_tasks.task_id')
            ->all());
    }

    // ----------[ Queries ]----------

    /**
     * The task placed in the phase at this position.
     */
    public static function create(Phase $phase, string $taskId, int $position): self
    {
        return self::query()->create(['phase_id' => $phase->id, 'task_id' => $taskId, 'position' => $position]);
    }

    /**
     * The task ids of each of the phases, each phase's in its order, read in one query and keyed by phase id.
     *
     * @param  list<string>  $phaseIds
     * @return array<string, list<string>>
     */
    public static function taskIdsByPhase(array $phaseIds): array
    {
        $taskIds = array_fill_keys($phaseIds, []);

        $phaseTasks = self::query()
            ->ofPhases($phaseIds)
            ->inPositionOrder()
            ->readAll('every task of the phases a plan read shows')
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
    public static function pageOf(string $phaseId, int $afterPosition, int $limit): array
    {
        return self::query()->ofPhase($phaseId)->placedAfter($afterPosition)->inPositionOrder()->readUpTo($limit)
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
     * @param  list<string>  $phaseIds
     */
    #[Scope]
    protected function ofPhases(Builder $query, array $phaseIds): void
    {
        $query->whereIn('phase_id', $phaseIds);
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
}
