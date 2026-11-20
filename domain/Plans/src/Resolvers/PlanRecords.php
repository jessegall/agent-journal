<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\AssigneeResolver;
use App\Assignments\Contracts\AssignmentResolver;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\NumberedPage;
use App\Hooks\Contracts\ActorWorkStacks;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use Domain\Plans\Api\AssignedPlanFilters;
use Domain\Plans\Api\AssignedPlanList;
use Domain\Plans\Api\PlanCard;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Api\PlanList;
use Domain\Plans\Api\PlanProgress;
use Domain\Plans\Api\PlanSelection;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Models\Plan;
use Domain\Plans\States\Support\WorkingOnPlanStateReference;
use Domain\Tasks\Api\TaskProgress;
use Domain\Tasks\Contracts\TaskProgressCounter;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The named reads of plans for whoever acts in this request. Every agent and the user read every plan. Task progress
 * comes from Tasks by task id and becomes Plans' own PlanProgress here; agent names come from Core's labels.
 */
#[Scoped]
final readonly class PlanRecords implements PlanResolver
{
    public const int PER_PAGE = PlanFilters::PAGE_SIZE;

    public function __construct(
        private CurrentActor $actors,
        private TaskProgressCounter $taskCounts,
        private AssignmentResolver $assignments,
        private AssigneeResolver $assignees,
        private AssignmentTransaction $transaction,
        private ActorWorkStacks $workStack,
    ) {}

    public function list(PlanFilters $filters): PlanList
    {
        $focused = $this->focusedPlanId();
        $total = $this->listed($filters)->count();
        $size = min(max(1, $filters->perPage), NumberedPage::LARGEST_SIZE);
        $lastPage = max(1, (int) ceil($total / $size));
        $page = min(max(1, $filters->page), $lastPage);
        $plans = $this->listed($filters)->listOrder($focused)->forPage($page, $size)->get();

        return new PlanList(
            $this->cardsOf($plans, $focused),
            $filters,
            $page,
            $size,
            $lastPage,
            $total,
            $this->selection($filters, $focused),
        );
    }

    /**
     * The plans a list counts and shows: by its search, and by its states when it names any.
     *
     * @return Builder<Plan>
     */
    private function listed(PlanFilters $filters): Builder
    {
        return Plan::query()->matching($filters->search)->when(
            $filters->states !== [],
            fn (Builder $query) => $query->inStates($filters->states),
        );
    }

    public function assignedToCaller(AssignedPlanFilters $filters): AssignedPlanList
    {
        $holder = AssigneeIdentity::of($this->actors->actor());
        $focused = $this->focusedPlanId();

        return $this->transaction->run(function () use ($filters, $holder, $focused): AssignedPlanList {
            $heldIds = $this->assignments->allRecordIdsFor(Plan::LINK_TYPE, $holder);
            $matching = Plan::query()->amongIds($heldIds)->matching($filters->search)->inStates($filters->states);
            $total = $matching->clone()->count();
            $plans = $matching->listOrder($focused)->forPage($filters->page->number, $filters->page->size)->get();

            return new AssignedPlanList($this->cardsOf($plans, $focused), $filters->page, $total);
        });
    }

    /**
     * The plan the caller's own stack works on now, read once from its highest live plan frame; none for an actor that
     * works on no stack, and never another target's plan.
     *
     * @return Option<string>
     */
    private function focusedPlanId(): Option
    {
        return $this->workStack->current(WorkingOnPlanStateReference::TYPE_KEY)
            ->flatMap(
                fn (
                    StateReference $frame,
                ) => $frame->subject instanceof SubjectReference ? new Some($frame->subject->id) : None::create(),
            );
    }

    /**
     * @param  Option<string>  $focused
     */
    private function selection(PlanFilters $filters, Option $focused): PlanSelection
    {
        if ($filters->selectedPlanId === null && $filters->selectedPlanNumber === null) {
            return PlanSelection::none();
        }

        $plan = $filters->selectedPlanId !== null
            ? Plan::query()->find($filters->selectedPlanId)
            : Plan::query()->where('number', $filters->selectedPlanNumber)->first();

        if ($plan === null) {
            return PlanSelection::missing();
        }

        $isInsideFilter = Plan::query()->matching($filters->search)->whereKey($plan->id)->exists();

        return PlanSelection::found($this->cardsOf($plan->newCollection([$plan]), $focused)[0], $isInsideFilter);
    }

    /**
     * One plan's card, with the same progress and current phase every list of plans shows.
     */
    public function cardOf(Plan $plan): PlanCard
    {
        return $this->cardsOf($plan->newCollection([$plan]), $this->focusedPlanId())[0];
    }

    /**
     * Builds the cards with a fixed number of queries: the phases, their task places, the task states, and the plans'
     * assignments with their holders' names through Core.
     *
     * @param  EloquentCollection<int, Plan>  $plans
     * @param  Option<string>  $focused
     * @return list<PlanCard>
     */
    private function cardsOf(EloquentCollection $plans, Option $focused): array
    {
        $phases = Phase::query()->whereIn(
            'plan_id',
            $plans->modelKeys(),
        )->readAll('every phase of the listed plans')->orderBy('number')->get();
        $phasesOfPlan = $phases->groupBy('plan_id');
        $taskIdsOfPhase = PhaseTask::query()->whereIn(
            'phase_id',
            $phases->modelKeys(),
        )->readAll('plan progress counts every task of the plan')->orderBy('position')->get()
            ->groupBy('phase_id')
            ->map(fn (Collection $places) => array_map(strval(...), array_values($places->pluck('task_id')->all())));
        $progressOfPhase = array_map(
            self::planProgressOf(...),
            $this->taskCounts->progressByGroup($taskIdsOfPhase->all()),
        );
        $holders = $this->assignees->holdersOfRecords(
            array_values($plans->map(fn (Plan $plan) => $plan->assignmentIdentity())->all()),
        );

        return array_values($plans->map(fn (Plan $plan) => $plan->card(
            $phasesOfPlan->get($plan->id, new Collection())->mapWithKeys(
                fn (Phase $phase) => [$phase->number => $progressOfPhase[$phase->id] ?? PlanProgress::none()],
            )->all(),
            $holders->forRecord($plan->assignmentIdentity()),
            $focused->getOrElse(null) === $plan->id,
        ))->all());
    }

    private static function planProgressOf(TaskProgress $progress): PlanProgress
    {
        return new PlanProgress($progress->done, $progress->started, $progress->blocked, $progress->total);
    }
}
