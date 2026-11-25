<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\ActorContextMissing;
use App\Models\Access\User;
use App\Support\ActorContext;
use App\Support\StackTransaction;
use App\Values\OwnerAuthority;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\Exceptions\StartDenied;
use Domain\Plans\Models\Plan;
use Domain\Plans\Resolvers\PlanResolver;
use Domain\Plans\Tests\TestCase;
use Domain\Plans\Values\PlanFilters;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Hooks\TestFailure;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

final class StartPlanTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits StartPlanCommand for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'plans',
        'phases',
        'phase_tasks',
        'tasks',
        'links',
        'assignments',
    ];

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([PlanStarted::class]);
        $this->plan = Plan::factory()->create([
            'title' => 'Build the plans page',
            'type' => PlanType::Build,
        ]);

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );
    }

    public function test_a_planned_plan_starts_once_and_says_who_started_it(): void
    {
        $this->startPlan($this->plan->id);

        $this->assertSame(PlanStatus::Started, $this->plan->fresh()?->status);
        Event::assertDispatchedTimes(PlanStarted::class, 1);

        Event::assertDispatched(
            PlanStarted::class,
            fn (
                PlanStarted $event,
            ) => $event->planId === $this->plan->id && $event->startedBy->type === User::storedType(),
        );
    }

    public function test_starting_a_started_plan_again_changes_nothing_and_raises_nothing(): void
    {
        $this->startPlan($this->plan->id);
        $this->startPlan($this->plan->id);

        Event::assertDispatchedTimes(PlanStarted::class, 1);
    }

    public function test_a_paused_plan_is_refused_and_stays_paused(): void
    {
        Plan::query()->whereKey($this->plan->id)->update(['status' => PlanStatus::Paused->value]);

        try {
            $this->startPlan($this->plan->id);
            $this->fail('A paused plan started.');
        } catch (StartDenied) {
            $this->assertSame(PlanStatus::Paused, $this->plan->fresh()?->status);
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
            $this->assertSame(PlanStatus::Planned, $this->plan->fresh()?->status);
            Event::assertNotDispatched(PlanStarted::class);
        }
    }

    public function test_the_read_offers_the_start_by_the_same_rule(): void
    {
        $paused = Plan::factory()->create([
            'title' => 'Paused plan',
            'type' => PlanType::Fix,
        ]);
        Plan::query()->whereKey($paused->id)->update(['status' => PlanStatus::Paused->value]);

        $canStart = [];

        foreach ($this->app->make(PlanResolver::class)->list(new PlanFilters())->cards as $card) {
            $canStart[$card->id] = $card->canStart;
        }

        $this->assertSame(
            [
                $this->plan->id => true,
                $paused->id => false,
            ],
            [
                $this->plan->id => $canStart[$this->plan->id],
                $paused->id => $canStart[$paused->id],
            ],
        );
    }

    public function test_a_request_without_an_actor_cannot_start(): void
    {
        $this->app->forgetScopedInstances();

        try {
            $this->startPlan($this->plan->id);
            $this->fail('A start without an actor went through.');
        } catch (ActorContextMissing) {
            $this->assertSame(PlanStatus::Planned, $this->plan->fresh()?->status);
        }
    }

    private function startPlan(string $planId): void
    {
        $this->app->make(CommandBus::class)->run(new StartPlanCommand($planId));
    }
}
