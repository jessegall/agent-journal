<?php

declare(strict_types=1);

namespace App\Domain\Plans\Models;

use App\Core\Links\Linkable;
use App\Domain\Plans\PlanKind;
use App\Domain\Plans\PlanState;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * A goal with phases in order and the tasks in each phase. Every agent and the owner read every plan, so it has no
 * agent limit (rule 4, message 519).
 *
 * @property int $id
 * @property string $title
 * @property PlanKind $kind
 * @property PlanState $state
 * @property bool $focused
 * @property int|null $agent_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['title', 'kind'])]
final class Plan extends Model
{
    use Linkable;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['state' => 'planned', 'focused' => false];

    /**
     * Adds a phase after the last one.
     */
    public function addPhase(string $title): Phase
    {
        return $this->phases()->create(['title' => $title, 'position' => $this->phases()->count() + 1]);
    }

    /**
     * Every task of the plan, phase by phase, in order.
     *
     * @return list<int>
     */
    public function taskIds(): array
    {
        $taskIds = PhaseTask::query()
            ->join('phases', 'phases.id', '=', 'phase_tasks.phase_id')
            ->where('phases.plan_id', $this->id)
            ->orderBy('phases.position')
            ->orderBy('phase_tasks.position')
            ->pluck('phase_tasks.task_id')
            ->all();

        return array_map(intval(...), array_values($taskIds));
    }

    /**
     * @return HasMany<Phase, $this>
     */
    public function phases(): HasMany
    {
        return $this->hasMany(Phase::class)->orderBy('position');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'kind' => PlanKind::class,
            'state' => PlanState::class,
            'focused' => 'boolean',
            'agent_id' => 'integer',
        ];
    }
}
