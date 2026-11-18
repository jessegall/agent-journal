<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use Domain\Plans\Api\PlanCard;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Readers\PlanRecords;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;

final class PlanRecordsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['plans', 'phases', 'phase_tasks', 'tasks', 'agents', 'assignments'];

    private Plan $build;

    private Plan $empty;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(7));

        $this->build = Plan::query()->create(['title' => 'Build the release page', 'type' => PlanType::Build]);
        $read = $this->build->addPhase('Read');
        $done = Task::query()->create(['title' => 'Done']);
        $done->finish();
        $read->addTasks([$done->id]);
        $this->build->addPhase('Start')->addTasks([Task::query()->create(['title' => 'Open'])->id]);
        $this->empty = Plan::query()->create(['title' => 'Compare chat layouts', 'type' => PlanType::Research]);
    }

    public function test_cards_carry_real_progress_the_current_phase_and_an_absent_agent(): void
    {
        $cards = $this->records()->list(new PlanFilters)->cards;

        $build = $this->cardOf($cards, $this->build);
        $empty = $this->cardOf($cards, $this->empty);

        $this->assertSame([1, 2, 2], [$build->progress->done, $build->progress->total, $build->currentPhase]);
        $this->assertTrue($build->holder->isEmpty());
        $this->assertSame([0, null], [$empty->progress->total, $empty->currentPhase]);
    }

    public function test_an_assigned_agent_is_named_and_the_focused_plan_comes_first(): void
    {
        $agent = Agent::query()->create(['name' => 'Planner', 'role' => 'hooks.main_ready']);
        Plan::query()->whereKey($this->build->id)->update(['focused' => true]);
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($agent->id));
        $this->app->make(AssignmentWriterInTransaction::class)->assign($this->build->assignmentIdentity(), ActorIdentity::of($agent));

        $cards = $this->records()->list(new PlanFilters)->cards;

        $this->assertSame([$this->build->id, 'Planner'], [$cards[0]->id, $cards[0]->holder->get()->name]);
        $this->assertTrue($cards[0]->holder->get()->actor()->isSameAs(ActorIdentity::of($agent)));
    }

    public function test_the_search_filters_and_an_empty_result_keeps_its_filters(): void
    {
        $this->assertSame([$this->build->id], array_map(fn (PlanCard $card) => $card->id, $this->records()->list(new PlanFilters(search: 'RELEASE'))->cards));

        $empty = $this->records()->list(new PlanFilters(search: 'nothing like this'));

        $this->assertSame([[], 'nothing like this', 0, 1], [$empty->cards, $empty->filters->search, $empty->total, $empty->page]);
    }

    public function test_a_page_past_the_end_becomes_the_last_page(): void
    {
        $list = $this->records()->list(new PlanFilters(page: 99));

        $this->assertSame([1, 1, 2], [$list->page, $list->lastPage, count($list->cards)]);
    }

    public function test_a_selected_plan_stays_readable_outside_the_filter_and_says_so(): void
    {
        $inside = $this->records()->list(new PlanFilters(search: 'release', selectedPlanId: $this->build->id))->selection;
        $outside = $this->records()->list(new PlanFilters(search: 'release', selectedPlanId: $this->empty->id))->selection;

        $this->assertSame([$this->build->id, true], [$inside->card?->id, $inside->isInsideFilter]);
        $this->assertSame([$this->empty->id, false], [$outside->card?->id, $outside->isInsideFilter]);
    }

    public function test_a_missing_selection_carries_no_title(): void
    {
        $selection = $this->records()->list(new PlanFilters(selectedPlanId: 999999))->selection;

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
