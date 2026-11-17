<?php

declare(strict_types=1);

namespace Tests\Feature\Plans;

use App\Core\Actors\ActorContext;
use App\Core\Actors\ActorKind;
use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Contracts\EstablishActor;
use App\Domain\Plans\Actions\StartPlan;
use App\Domain\Plans\Api\PlanFilters;
use App\Domain\Plans\Api\PlanKind;
use App\Domain\Plans\Api\PlanState;
use App\Domain\Plans\Events\PlanStarted;
use App\Domain\Plans\Exceptions\StartDenied;
use App\Domain\Plans\Models\Plan;
use App\Domain\Plans\PlanRecords;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Hooks\TestFailure;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class StartPlanTest extends TestCase
{
    use RefreshHookDatabase;

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([PlanStarted::class]);
        $this->plan = Plan::query()->create(['title' => 'Build the plans page', 'kind' => PlanKind::Build]);
        $this->app->make(EstablishActor::class)->establish(ActorContext::forUser(7));
    }

    public function test_a_planned_plan_starts_once_and_says_who_started_it(): void
    {
        $this->startPlan()->start($this->plan);

        $this->assertSame(PlanState::Started, $this->plan->fresh()?->state);
        Event::assertDispatchedTimes(PlanStarted::class, 1);
        Event::assertDispatched(PlanStarted::class, fn (PlanStarted $event) => $event->planId === $this->plan->id && $event->startedBy->kind === ActorKind::User);
    }

    public function test_starting_a_started_plan_again_changes_nothing_and_raises_nothing(): void
    {
        $this->startPlan()->start($this->plan);
        $this->startPlan()->start($this->plan);

        Event::assertDispatchedTimes(PlanStarted::class, 1);
    }

    public function test_a_paused_plan_is_refused_and_stays_paused(): void
    {
        Plan::query()->whereKey($this->plan->id)->update(['state' => PlanState::Paused->value]);

        try {
            $this->startPlan()->start($this->plan);
            $this->fail('A paused plan started.');
        } catch (StartDenied) {
            $this->assertSame(PlanState::Paused, $this->plan->fresh()?->state);
            Event::assertNotDispatched(PlanStarted::class);
        }
    }

    public function test_a_start_that_rolls_back_raises_nothing(): void
    {
        try {
            $this->app->make(ConnectionInterface::class)->transaction(function (): void {
                $this->startPlan()->start($this->plan);

                throw TestFailure::failedAfterTheStart();
            });
        } catch (TestFailure) {
            $this->assertSame(PlanState::Planned, $this->plan->fresh()?->state);
            Event::assertNotDispatched(PlanStarted::class);
        }
    }

    public function test_the_read_offers_the_start_by_the_same_rule(): void
    {
        $paused = Plan::query()->create(['title' => 'Paused plan', 'kind' => PlanKind::Fix]);
        Plan::query()->whereKey($paused->id)->update(['state' => PlanState::Paused->value]);

        $canStart = [];

        foreach ($this->app->make(PlanRecords::class)->list(new PlanFilters)->cards as $card) {
            $canStart[$card->id] = $card->canStart;
        }

        $this->assertSame([$this->plan->id => true, $paused->id => false], [$this->plan->id => $canStart[$this->plan->id], $paused->id => $canStart[$paused->id]]);
    }

    public function test_a_request_without_an_actor_cannot_start(): void
    {
        $this->app->forgetScopedInstances();

        $this->expectException(ActorContextMissing::class);

        $this->startPlan();
    }

    private function startPlan(): StartPlan
    {
        return $this->app->make(StartPlan::class);
    }
}
