<?php

declare(strict_types=1);

namespace App\Domain\Plans;

use App\Core\Agents\Contracts\AgentReader;
use App\Core\Contracts\CurrentActor;
use App\Domain\Plans\Api\PlanCard;
use App\Domain\Plans\Api\PlanFilters;
use App\Domain\Plans\Api\PlanList;
use App\Domain\Plans\Api\PlanProgress;
use App\Domain\Plans\Api\PlanSelection;
use App\Domain\Plans\Contracts\PlanReader;
use App\Domain\Plans\Models\Phase;
use App\Domain\Plans\Models\PhaseTask;
use App\Domain\Plans\Models\Plan;
use App\Domain\Tasks\Api\TaskProgress;
use App\Domain\Tasks\Contracts\TaskProgressCounter;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

/**
 * The named reads of plans for whoever acts in this request. Every agent and the user read every plan. Task progress
 * comes from Tasks by task id and becomes Plans' own PlanProgress here; agent names come from Core's labels.
 */
#[Scoped]
final readonly class PlanRecords implements PlanReader
{
    public const int PER_PAGE = 20;

    public function __construct(
        private CurrentActor $actors,
        private TaskProgressCounter $taskCounts,
        private AgentReader $agents,
    ) {}

    public function list(PlanFilters $filters): PlanList
    {
        $this->actors->actor();
        $total = Plan::query()->matching($filters->search)->count();
        $lastPage = max(1, (int) ceil($total / self::PER_PAGE));
        $page = min(max(1, $filters->page), $lastPage);
        $plans = Plan::query()->matching($filters->search)->listOrder()->forPage($page, self::PER_PAGE)->get();

        return new PlanList($this->cardsOf($plans), $filters, $page, $lastPage, $total, $this->selection($filters));
    }

    private function selection(PlanFilters $filters): PlanSelection
    {
        if ($filters->selectedPlanId === null) {
            return PlanSelection::none();
        }

        $plan = Plan::query()->find($filters->selectedPlanId);

        if ($plan === null) {
            return PlanSelection::missing();
        }

        $isInsideFilter = Plan::query()->matching($filters->search)->whereKey($plan->id)->exists();

        return PlanSelection::found($this->cardsOf($plan->newCollection([$plan]))[0], $isInsideFilter);
    }

    /**
     * Builds the cards with four queries in all: the phases, their task places, the task states and the agent labels.
     *
     * @param  EloquentCollection<int, Plan>  $plans
     * @return list<PlanCard>
     */
    private function cardsOf(EloquentCollection $plans): array
    {
        $phases = Phase::query()->whereIn('plan_id', $plans->modelKeys())->orderBy('position')->get();
        $phasesOfPlan = $phases->groupBy('plan_id');
        $taskIdsOfPhase = PhaseTask::query()->whereIn('phase_id', $phases->modelKeys())->orderBy('position')->get()
            ->groupBy('phase_id')
            ->map(fn (Collection $places) => array_map(intval(...), array_values($places->pluck('task_id')->all())));
        $progressOfPhase = array_map(self::planProgressOf(...), $this->taskCounts->progressByGroup($taskIdsOfPhase->all()));
        $labels = $this->agents->labelsFor(array_values(array_unique(array_map(intval(...), $plans->pluck('agent_id')->filter()->all()))));

        return array_values($plans->map(fn (Plan $plan) => $plan->card(
            $phasesOfPlan->get($plan->id, new Collection)->mapWithKeys(fn (Phase $phase) => [$phase->position => $progressOfPhase[$phase->id] ?? PlanProgress::none()])->all(),
            $plan->agent_id === null ? null : ($labels[$plan->agent_id] ?? null)?->name,
        ))->all());
    }

    private static function planProgressOf(TaskProgress $progress): PlanProgress
    {
        return new PlanProgress($progress->done, $progress->started, $progress->blocked, $progress->total);
    }
}
