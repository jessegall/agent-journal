<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use App\Hooks\Support\StackTransaction;
use Domain\Plans\Api\Events\PlanStarted;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Exceptions\StartDenied;
use Domain\Plans\Models\Plan;
use Domain\Plans\Resolvers\PlanRecords;
use Domain\Plans\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Hooks\TestFailure;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

final class StartPlanTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits StartPlan for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['plans', 'phases', 'phase_tasks', 'tasks', 'links', 'assignments'];

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([PlanStarted::class]);
        $this->plan = Plan::factory()->create(['title' => 'Build the plans page', 'type' => PlanType::Build]);
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)));
    }

    public function test_a_planned_plan_starts_once_and_says_who_started_it(): void
    {
        $this->startPlan($this->plan->id);

        $this->assertSame(PlanState::Started, $this->plan->fresh()?->state);
        Event::assertDispatchedTimes(PlanStarted::class, 1);
        Event::assertDispatched(PlanStarted::class, fn (PlanStarted $event) => $event->planId === $this->plan->id && $event->startedBy->type === ActorType::User);
    }

    public function test_starting_a_started_plan_again_changes_nothing_and_raises_nothing(): void
    {
        $this->startPlan($this->plan->id);
        $this->startPlan($this->plan->id);

        Event::assertDispatchedTimes(PlanStarted::class, 1);
    }

    public function test_a_paused_plan_is_refused_and_stays_paused(): void
    {
        Plan::query()->whereKey($this->plan->id)->update(['state' => PlanState::Paused->value]);

        try {
            $this->startPlan($this->plan->id);
            $this->fail('A paused plan started.');
        } catch (StartDenied) {
            $this->assertSame(PlanState::Paused, $this->plan->fresh()?->state);
            Event::assertNotDispatched(PlanStarted::class);
        }
    }

    public function test_a_start_that_rolls_back_raises_nothing(): void
    {
        try {
            $this->app->make(StackTransaction::class)->run(function (): void {
                $this->startPlan($this->plan->id);

                throw TestFailure::failedAfterTheStart();
            });
        } catch (TestFailure) {
            $this->assertSame(PlanState::Planned, $this->plan->fresh()?->state);
            Event::assertNotDispatched(PlanStarted::class);
        }
    }

    public function test_the_read_offers_the_start_by_the_same_rule(): void
    {
        $paused = Plan::factory()->create(['title' => 'Paused plan', 'type' => PlanType::Fix]);
        Plan::query()->whereKey($paused->id)->update(['state' => PlanState::Paused->value]);

        $canStart = [];

        foreach ($this->app->make(PlanRecords::class)->list(new PlanFilters())->cards as $card) {
            $canStart[$card->id] = $card->canStart;
        }

        $this->assertSame([$this->plan->id => true, $paused->id => false], [$this->plan->id => $canStart[$this->plan->id], $paused->id => $canStart[$paused->id]]);
    }

    public function test_a_request_without_an_actor_cannot_start(): void
    {
        $this->app->forgetScopedInstances();

        try {
            $this->startPlan($this->plan->id);
            $this->fail('A start without an actor went through.');
        } catch (ActorContextMissing) {
            $this->assertSame(PlanState::Planned, $this->plan->fresh()?->state);
        }
    }

    private function startPlan(string $planId): void
    {
        $this->app->make(CommandBus::class)->run(new StartPlan($planId));
    }
}
