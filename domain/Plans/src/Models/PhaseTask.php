<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Reads\Support\CountsPivotLoads;
use App\Reads\Values\ReadOrder;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
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
    use BoundedReads, CountsPivotLoads;
    use HasUlids, Linkable;

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

    /**
     * The places of a phase in their order; the table has no created_at.
     */
    public function defaultReadOrder(): ReadOrder
    {
        return ReadOrder::by(['phase_tasks.phase_id', 'phase_tasks.position'], 'phase_tasks.id');
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
        $places = self::query()
            ->whereIn('phase_id', $phaseIds)
            ->readAll('every task of the phases a plan read shows')
            ->orderBy('position')
            ->get(['phase_id', 'task_id']);

        foreach ($places as $place) {
            $taskIds[$place->phase_id][] = (string) $place->task_id;
        }

        return $taskIds;
    }
}
