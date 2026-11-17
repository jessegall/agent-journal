<?php

declare(strict_types=1);

namespace App\Domain\Plans\Models;

use App\Core\Agents\Models\Agent;
use App\Core\Links\Linkable;
use App\Domain\Plans\PlanCard;
use App\Domain\Plans\PlanKind;
use App\Domain\Plans\PlanState;
use App\Domain\Tasks\TaskProgress;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
 * @property-read Agent|null $agent
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
     * The card of this plan from the progress of each phase, keyed by the phase's position. The current phase is the
     * first one with unfinished tasks, or the last phase once every task is done; a plan without phases has none.
     *
     * @param  array<int, TaskProgress>  $progressOfPhase
     */
    public function card(array $progressOfPhase): PlanCard
    {
        $progress = array_reduce($progressOfPhase, fn (TaskProgress $sum, TaskProgress $phase) => $sum->plus($phase), TaskProgress::none());
        $unfinished = array_keys(array_filter($progressOfPhase, fn (TaskProgress $phase) => ! $phase->isComplete()));
        $currentPhase = $unfinished[0] ?? array_key_last($progressOfPhase);

        return new PlanCard($this->id, $this->title, $this->kind, $this->state, $this->focused, $progress, $currentPhase, $this->agent?->name);
    }

    /**
     * Plans whose title holds the search words, matched without regard to case; an empty search matches every plan.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function matching(Builder $query, string $search): void
    {
        if (trim($search) === '') {
            return;
        }

        $query->whereLike('title', '%'.addcslashes(trim($search), '%_\\').'%', caseSensitive: false);
    }

    /**
     * The focused plan first, then the newest.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function listOrder(Builder $query): void
    {
        $query->orderByDesc('focused')->orderByDesc('id');
    }

    /**
     * @return BelongsTo<Agent, $this>
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
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
