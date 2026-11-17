<?php

declare(strict_types=1);

namespace App\Domain\Plans\Readers;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Contracts\AssigneeReader;
use App\Core\Assignments\Contracts\AssignmentReader;
use App\Core\Assignments\Contracts\AssignmentTransaction;
use App\Core\Contracts\CurrentActor;
use App\Domain\Plans\Api\AssignedPlanFilters;
use App\Domain\Plans\Api\AssignedPlanList;
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
use Illuminate\Database\Eloquent\Builder;
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
        private AssignmentReader $assignments,
        private AssigneeReader $assignees,
        private AssignmentTransaction $transaction,
    ) {}

    public function list(PlanFilters $filters): PlanList
    {
        $this->actors->actor();
        $total = $this->listed($filters)->count();
        $lastPage = max(1, (int) ceil($total / self::PER_PAGE));
        $page = min(max(1, $filters->page), $lastPage);
        $plans = $this->listed($filters)->listOrder()->forPage($page, self::PER_PAGE)->get();

        return new PlanList($this->cardsOf($plans), $filters, $page, $lastPage, $total, $this->selection($filters));
    }

    /**
     * The plans a list counts and shows: by its search, and by its states when it names any.
     *
     * @return Builder<Plan>
     */
    private function listed(PlanFilters $filters): Builder
    {
        return Plan::query()->matching($filters->search)->when($filters->states !== [], fn (Builder $query) => $query->inStates($filters->states));
    }

    public function assignedToCaller(AssignedPlanFilters $filters): AssignedPlanList
    {
        $caller = $this->actors->actor();
        $caller->requireAgent();
        $holder = ActorIdentity::of($caller);

        return $this->transaction->run(function () use ($filters, $holder): AssignedPlanList {
            $heldIds = $this->assignments->allRecordIdsFor(Plan::LINK_TYPE, $holder);
            $matching = Plan::query()->amongIds($heldIds)->matching($filters->search)->inStates($filters->states);
            $total = $matching->clone()->count();
            $plans = $matching->listOrder()->forPage($filters->page->number, $filters->page->size)->get();

            return new AssignedPlanList($this->cardsOf($plans), $filters->page, $total);
        });
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
     * Builds the cards with a fixed number of queries: the phases, their task places, the task states, and the plans'
     * assignments with their holders' names through Core.
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
        $assignments = $this->assignments->assignmentsFor(array_values($plans->map(fn (Plan $plan) => $plan->assignmentIdentity())->all()));
        $holders = $this->assignees->holdersOf($assignments);

        return array_values($plans->map(fn (Plan $plan) => $plan->card(
            $phasesOfPlan->get($plan->id, new Collection)->mapWithKeys(fn (Phase $phase) => [$phase->position => $progressOfPhase[$phase->id] ?? PlanProgress::none()])->all(),
            $holders->forRecord($plan->assignmentIdentity()),
        ))->all());
    }

    private static function planProgressOf(TaskProgress $progress): PlanProgress
    {
        return new PlanProgress($progress->done, $progress->started, $progress->blocked, $progress->total);
    }
}
