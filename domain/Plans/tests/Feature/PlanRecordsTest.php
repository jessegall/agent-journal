<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Models\Agent;
use App\Agents\Support\StackTarget;
use App\Assignments\Support\AssigneeIdentity;
use App\Hooks\Contracts\CurrentState;
use Domain\Plans\Api\PlanCard;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Resolvers\PlanRecords;
use Domain\Plans\States\Support\WorkingOnPlanStateReference;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Tests\Fixtures\Hooks\FixedCurrentState;
use Tests\Fixtures\Hooks\FixedSession;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;

final class PlanRecordsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['plans', 'phases', 'phase_tasks', 'tasks', 'agents', 'assignments'];

    private Plan $build;

    private Plan $empty;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );

        $this->build = Plan::factory()->create(['title' => 'Build the release page', 'type' => PlanType::Build]);
        $read = $this->build->addPhase('Read');
        $done = Task::factory()->create(['title' => 'Done']);
        $done->finish();
        $read->addTasks([$done->id]);
        $this->build->addPhase('Start')->addTasks([Task::factory()->create(['title' => 'Open'])->id]);
        $this->empty = Plan::factory()->create(['title' => 'Compare chat layouts', 'type' => PlanType::Research]);
    }

    public function test_cards_carry_real_progress_the_current_phase_and_an_absent_agent(): void
    {
        $cards = $this->records()->list(new PlanFilters())->cards;

        $this->assertSame([false, false], array_map(fn (PlanCard $card) => $card->focused, $cards));

        $build = $this->cardOf($cards, $this->build);
        $empty = $this->cardOf($cards, $this->empty);

        $this->assertSame([1, 2, 2], [$build->progress->done, $build->progress->total, $build->currentPhase]);
        $this->assertTrue($build->holder->isEmpty());
        $this->assertSame([0, null], [$empty->progress->total, $empty->currentPhase]);
    }

    public function test_an_assigned_agent_is_named_and_the_plan_its_stack_works_on_comes_first(): void
    {
        $agent = Agent::named('Planner', 'main-agent');
        $this->app->instance(CurrentSession::class, new FixedSession(TestIds::of(10)));
        $this->app->instance(
            CurrentState::class,
            new FixedCurrentState(
                new StackTarget($agent->id, TestIds::of(10)),
                [WorkingOnPlanStateReference::TYPE_KEY => WorkingOnPlanStateReference::forPlan($this->build)],
            ),
        );
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($agent->id),
            TestStartAuthority::forAgent($agent->id),
        );
        $this->app->make(AssignmentWriterInTransaction::class)->assign(
            $this->build->assignmentIdentity(),
            AssigneeIdentity::of($agent),
        );

        $cards = $this->records()->list(new PlanFilters())->cards;

        $this->assertSame(
            [$this->build->id, 'Planner', true],
            [$cards[0]->id, $cards[0]->holder->get()->name, $cards[0]->focused],
        );
        $this->assertTrue($cards[0]->holder->get()->holder()->isSameAs(AssigneeIdentity::of($agent)));
    }

    public function test_the_search_filters_and_an_empty_result_keeps_its_filters(): void
    {
        $this->assertSame(
            [$this->build->id],
            array_map(
                fn (PlanCard $card) => $card->id,
                $this->records()->list(new PlanFilters(search: 'RELEASE'))->cards,
            ),
        );

        $empty = $this->records()->list(new PlanFilters(search: 'nothing like this'));

        $this->assertSame(
            [[], 'nothing like this', 0, 1],
            [$empty->cards, $empty->filters->search, $empty->total, $empty->page],
        );
    }

    public function test_a_page_past_the_end_becomes_the_last_page(): void
    {
        $planPage = $this->records()->list(new PlanFilters(page: 99));

        $this->assertSame([1, 1, 2], [$planPage->page, $planPage->lastPage, count($planPage->cards)]);
    }

    public function test_a_selected_plan_stays_readable_outside_the_filter_and_says_so(): void
    {
        $inside = $this->records()->list(
            new PlanFilters(search: 'release', selectedPlanId: $this->build->id),
        )->selection;
        $outside = $this->records()->list(
            new PlanFilters(search: 'release', selectedPlanId: $this->empty->id),
        )->selection;

        $this->assertSame([$this->build->id, true], [$inside->card?->id, $inside->isInsideFilter]);
        $this->assertSame([$this->empty->id, false], [$outside->card?->id, $outside->isInsideFilter]);
    }

    public function test_a_missing_selection_carries_no_title(): void
    {
        $selection = $this->records()->list(new PlanFilters(selectedPlanId: TestIds::of(99999)))->selection;

        $this->assertTrue($selection->isMissing());
        $this->assertNull($selection->card);
    }

    private function records(): PlanRecords
    {
        return $this->app->make(PlanRecords::class);
    }

    /**
     * @param  list<PlanCard>  $cards
     */
    private function cardOf(array $cards, Plan $plan): PlanCard
    {
        return array_values(array_filter($cards, fn (PlanCard $card) => $card->id === $plan->id))[0];
    }
}
