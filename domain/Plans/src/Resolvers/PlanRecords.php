<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Assignments\AssigneeResolver;
use App\Contracts\Assignments\AssignmentResolver;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Work\CurrentState;
use App\Support\AssigneeIdentity;
use App\Support\NumberedPage;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\States\Support\WorkingOnPlanStateReference;
use Domain\Plans\Values\AssignedPlanFilters;
use Domain\Plans\Values\AssignedPlanList;
use Domain\Plans\Values\PlanCard;
use Domain\Plans\Values\PlanFilters;
use Domain\Plans\Values\PlanList;
use Domain\Plans\Values\PlanSelection;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The named reads of plans for whoever acts in this request. Every agent and the user read every plan. Progress comes
 * from the task tallies Plans keeps on its plan and phase rows, never from reading the tasks; agent names come from
 * Core's labels.
 */
#[Scoped]
final readonly class PlanRecords implements PlanResolver
{
    public const int PER_PAGE = PlanFilters::PAGE_SIZE;

    public function __construct(
        private CurrentActor $actors,
        private AssignmentResolver $assignments,
        private AssigneeResolver $assignees,
        private AssignmentTransaction $transaction,
        private CurrentState $states,
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
        return $this->states->ofCaller(WorkingOnPlanStateReference::TYPE_KEY)
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

        return PlanSelection::found(
            $this->cardsOf($plan->newCollection([$plan]), $focused)[0],
            $isInsideFilter,
            $plan->brief,
        );
    }

    /**
     * One plan's card, with the same progress and current phase every list of plans shows.
     */
    public function cardOf(Plan $plan): PlanCard
    {
        return $this->cardsOf($plan->newCollection([$plan]), $this->focusedPlanId())[0];
    }

    /**
     * The cards of these plans, with the same progress and current phase every list of plans shows.
     *
     * @param  EloquentCollection<int, Plan>  $plans
     * @return list<PlanCard>
     */
    public function cardsOfPlans(EloquentCollection $plans): array
    {
        return $this->cardsOf($plans, $this->focusedPlanId());
    }

    /**
     * Builds the cards with a fixed number of queries, none of them over tasks or over every phase: each plan's
     * current phase from the phase tallies in one grouped query, and the plans' assignments with their holders' names
     * through Core.
     *
     * @param  EloquentCollection<int, Plan>  $plans
     * @param  Option<string>  $focused
     * @return list<PlanCard>
     */
    private function cardsOf(EloquentCollection $plans, Option $focused): array
    {
        $currentPhaseOf = Phase::currentNumbersOf(array_values(array_map(strval(...), $plans->modelKeys())));

        $holders = $this->assignees->holdersOfRecords(
            array_values($plans->map(fn (Plan $plan) => $plan->assignmentIdentity())->all()),
        );

        return array_values($plans->map(fn (Plan $plan) => $plan->card(
            $currentPhaseOf[$plan->id] ?? null,
            $holders->forRecord($plan->assignmentIdentity()),
            $focused->getOrElse(null) === $plan->id,
        ))->all());
    }
}
