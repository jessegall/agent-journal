<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Sessions\CurrentSession;
use App\Contracts\Work\CurrentState;
use App\Models\Agents\Agent;
use App\Support\ActorContext;
use App\Support\AssigneeIdentity;
use App\Values\OwnerAuthority;
use App\Values\StackTarget;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Resolvers\PlanResolver;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Support\States\Support\WorkOnPlanStateReference;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Plans\Values\PlanCard;
use Domain\Plans\Values\PlanFilters;
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

    private const array TABLES = [
        'plans',
        'phases',
        'phase_tasks',
        'tasks',
        'agents',
        'assignments',
    ];

    private Plan $build;

    private Plan $empty;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );

        $plans = $this->journal->owner()->fixtures(PlanFixtures::class)
            ->plan('Build the release page')
            ->plan('Compare chat layouts', type: PlanType::Research);
        $this->build = $plans->planCalled('Build the release page');
        $read = $this->planStructure()->addPhase($this->build, 'Read');
        $done = Task::factory()->create(['title' => 'Done']);
        $done->finish('Done.');
        $this->planStructure()->addTasks($read, [$done->id]);

        $this->planStructure()->addTasks(
            $this->planStructure()->addPhase($this->build, 'Start'),
            [Task::factory()->create(['title' => 'Open'])->id],
        );

        $this->empty = $plans->planCalled('Compare chat layouts');
    }

    public function test_cards_carry_real_progress_the_current_phase_and_an_absent_agent(): void
    {
        $cards = $this->records()->list(new PlanFilters())->cards;

        $this->assertSame([
            false,
            false,
        ], array_map(fn (PlanCard $card) => $card->isFocused, $cards));

        $build = $this->cardOf($cards, $this->build);
        $empty = $this->cardOf($cards, $this->empty);

        $this->assertSame([
            1,
            2,
            2,
        ], [
            $build->progress->finished,
            $build->progress->total,
            $build->currentPhase,
        ]);
        $this->assertTrue($build->holder->isEmpty());
        $this->assertSame([
            0,
            null,
        ], [
            $empty->progress->total,
            $empty->currentPhase,
        ]);
    }

    public function test_an_assigned_agent_is_named_and_the_plan_its_stack_works_on_comes_first(): void
    {
        $agent = Agent::create('Planner', 'main-agent', $this->localProject());
        $this->app->instance(CurrentSession::class, new FixedSession(TestIds::of(10)));

        $this->app->instance(
            CurrentState::class,
            new FixedCurrentState(
                new StackTarget($agent->id, TestIds::of(10)),
                [WorkOnPlanStateReference::TYPE_KEY => WorkOnPlanStateReference::forPlan($this->build->id)],
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
            [
                $this->build->id,
                'Planner',
                true,
            ],
            [
                $cards[0]->id,
                $cards[0]->holder->get()->name,
                $cards[0]->isFocused,
            ],
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
            [
                [],
                'nothing like this',
                0,
                1,
            ],
            [
                $empty->cards,
                $empty->filters->search,
                $empty->total,
                $empty->page,
            ],
        );
    }

    public function test_a_page_past_the_end_becomes_the_last_page(): void
    {
        $planPage = $this->records()->list(new PlanFilters(page: 99));

        $this->assertSame([
            1,
            1,
            2,
        ], [
            $planPage->page,
            $planPage->lastPage,
            count($planPage->cards),
        ]);
    }

    public function test_a_selected_plan_stays_readable_outside_the_filter_and_says_so(): void
    {
        $inside = $this->records()->list(
            new PlanFilters(search: 'release', selectedPlanId: $this->build->id),
        )->selection;

        $outside = $this->records()->list(
            new PlanFilters(search: 'release', selectedPlanId: $this->empty->id),
        )->selection;

        $this->assertSame([
            $this->build->id,
            true,
        ], [
            $inside->card?->id,
            $inside->isInsideFilter,
        ]);
        $this->assertSame([
            $this->empty->id,
            false,
        ], [
            $outside->card?->id,
            $outside->isInsideFilter,
        ]);
    }

    public function test_a_missing_selection_carries_no_title(): void
    {
        $selection = $this->records()->list(new PlanFilters(selectedPlanId: TestIds::of(99999)))->selection;

        $this->assertTrue($selection->isMissing());
        $this->assertNull($selection->card);
    }

    private function records(): PlanResolver
    {
        return $this->app->make(PlanResolver::class);
    }

    /**
     * @param  list<PlanCard>  $cards
     */
    private function cardOf(array $cards, Plan $plan): PlanCard
    {
        return array_values(array_filter($cards, fn (PlanCard $card) => $card->id === $plan->id))[0];
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
