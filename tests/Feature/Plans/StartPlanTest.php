<?php

declare(strict_types=1);

namespace Tests\Feature\Plans;

use App\Core\Actors\Contracts\CurrentActorSetter;
use App\Core\Actors\Enums\ActorType;
use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Support\ActorContext;
use App\Domain\Plans\Api\Events\PlanStarted;
use App\Domain\Plans\Api\PlanFilters;
use App\Domain\Plans\Contracts\PlanStarter;
use App\Domain\Plans\Enums\PlanState;
use App\Domain\Plans\Enums\PlanType;
use App\Domain\Plans\Exceptions\StartDenied;
use App\Domain\Plans\Models\Plan;
use App\Domain\Plans\Readers\PlanRecords;
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
        $this->plan = Plan::query()->create(['title' => 'Build the plans page', 'type' => PlanType::Build]);
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(7));
    }

    public function test_a_planned_plan_starts_once_and_says_who_started_it(): void
    {
        $this->startPlan()->start($this->plan->id);

        $this->assertSame(PlanState::Started, $this->plan->fresh()?->state);
        Event::assertDispatchedTimes(PlanStarted::class, 1);
        Event::assertDispatched(PlanStarted::class, fn (PlanStarted $event) => $event->planId === $this->plan->id && $event->startedBy->type === ActorType::User);
    }

    public function test_starting_a_started_plan_again_changes_nothing_and_raises_nothing(): void
    {
        $this->startPlan()->start($this->plan->id);
        $this->startPlan()->start($this->plan->id);

        Event::assertDispatchedTimes(PlanStarted::class, 1);
    }

    public function test_a_paused_plan_is_refused_and_stays_paused(): void
    {
        Plan::query()->whereKey($this->plan->id)->update(['state' => PlanState::Paused->value]);

        try {
            $this->startPlan()->start($this->plan->id);
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
                $this->startPlan()->start($this->plan->id);

                throw TestFailure::failedAfterTheStart();
            });
        } catch (TestFailure) {
            $this->assertSame(PlanState::Planned, $this->plan->fresh()?->state);
            Event::assertNotDispatched(PlanStarted::class);
        }
    }

    public function test_the_read_offers_the_start_by_the_same_rule(): void
    {
        $paused = Plan::query()->create(['title' => 'Paused plan', 'type' => PlanType::Fix]);
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

        try {
            $this->startPlan()->start($this->plan->id);
            $this->fail('A start without an actor went through.');
        } catch (ActorContextMissing) {
            $this->assertSame(PlanState::Planned, $this->plan->fresh()?->state);
        }
    }

    private function startPlan(): PlanStarter
    {
        return $this->app->make(PlanStarter::class);
    }
}
