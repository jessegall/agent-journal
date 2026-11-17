<?php

declare(strict_types=1);

namespace App\Domain\Plans;

use App\Domain\Plans\Models\Phase;
use App\Domain\Plans\Models\PhaseTask;
use App\Domain\Plans\Models\Plan;
use App\Domain\Tasks\TaskCounts;
use App\Domain\Tasks\TaskProgress;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

/**
 * The named reads of plans. Every agent and the owner read every plan, so these need no actor scope; the actor is
 * already established by the request's middleware. Task progress comes from Tasks, by task id.
 */
final readonly class PlanRecords
{
    public const PER_PAGE = 20;

    public function __construct(private TaskCounts $taskCounts) {}

    public function list(PlanFilters $filters): PlanList
    {
        $total = Plan::query()->matching($filters->search)->count();
        $lastPage = max(1, (int) ceil($total / self::PER_PAGE));
        $page = min(max(1, $filters->page), $lastPage);
        $plans = Plan::query()->matching($filters->search)->listOrder()->with('agent')->forPage($page, self::PER_PAGE)->get();

        return new PlanList($this->cardsOf($plans), $filters, $page, $lastPage, $total, $this->selection($filters));
    }

    private function selection(PlanFilters $filters): PlanSelection
    {
        if ($filters->selectedPlanId === null) {
            return PlanSelection::none();
        }

        $plan = Plan::query()->with('agent')->find($filters->selectedPlanId);

        if ($plan === null) {
            return PlanSelection::missing();
        }

        $isInsideFilter = Plan::query()->matching($filters->search)->whereKey($plan->id)->exists();

        return PlanSelection::found($this->cardsOf($plan->newCollection([$plan]))[0], $isInsideFilter);
    }

    /**
     * Builds the cards with three queries in all: the phases, their task places and the task states.
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
        $progressOfPhase = $this->taskCounts->progressByGroup($taskIdsOfPhase->all());

        return array_values($plans->map(fn (Plan $plan) => $plan->card(
            $phasesOfPlan->get($plan->id, new Collection)->mapWithKeys(fn (Phase $phase) => [$phase->position => $progressOfPhase[$phase->id] ?? TaskProgress::none()])->all(),
        ))->all());
    }
}
