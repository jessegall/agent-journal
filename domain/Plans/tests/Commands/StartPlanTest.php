<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Exceptions\ActorContextMissing;
use App\Models\Access\User;
use App\Support\StackTransaction;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\Exceptions\StartDenied;
use Domain\Plans\Resolvers\PlanResolver;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Plans\Values\PlanFilters;
use Tests\Fixtures\Hooks\TestFailure;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * A planned plan starts once and says who started it; a paused plan, a start that rolls back and a request with no
 * actor leave it as it was and announce nothing.
 */
#[TestsCommand(StartPlanCommand::class)]
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
        'users',
        'number_groups',
        'command_receipts',
    ];

    private PlanFixtures $plans;

    protected function setUp(): void
    {
        parent::setUp();

        $this->plans = $this->journal->owner()->fixtures(PlanFixtures::class)->plan('Release');
        $this->journal->observeEvents(PlanStarted::class);
    }

    public function test_a_planned_plan_starts_once_and_says_who_started_it(): void
    {
        $plan = $this->plans->planCalled('Release')->id;

        $this->journal->run(new StartPlanCommand($plan));

        $this->plans->assertStatus('Release', PlanStatus::Started);

        $this->journal->assertEvent(
            PlanStarted::class,
            fn (PlanStarted $event) => $event->planId === $plan && $event->startedBy->type === User::storedType(),
        );
    }

    public function test_starting_a_started_plan_again_changes_nothing_and_raises_nothing(): void
    {
        $plan = $this->plans->planCalled('Release')->id;

        $this->journal->run(new StartPlanCommand($plan));
        $this->journal->run(new StartPlanCommand($plan));

        $this->journal->assertEventCount(PlanStarted::class, 1);
    }

    public function test_a_paused_plan_is_refused_and_stays_paused(): void
    {
        $this->plans->pausedPlan('Later');
        $this->journal->observeEvents(PlanStarted::class);

        $this->journal->assertRefused(
            StartDenied::class,
            fn () => $this->journal->run(new StartPlanCommand($this->plans->planCalled('Later')->id)),
        );

        $this->plans->assertStatus('Later', PlanStatus::Paused);
        $this->journal->assertEventCount(PlanStarted::class, 0);
    }

    public function test_a_start_that_rolls_back_raises_nothing(): void
    {
        $plan = $this->plans->planCalled('Release')->id;

        try {
            $this->app->make(StackTransaction::class)->run(function () use ($plan): void {
                $this->journal->run(new StartPlanCommand($plan));

                throw TestFailure::failedAfterTheStart();
            });
        } catch (TestFailure) {
            $this->plans->assertStatus('Release', PlanStatus::Planned);
            $this->journal->assertEventCount(PlanStarted::class, 0);
        }
    }

    public function test_the_read_offers_the_start_by_the_same_rule(): void
    {
        $this->plans->pausedPlan('Later');
        $canStart = [];

        foreach ($this->app->make(PlanResolver::class)->list(new PlanFilters())->cards as $card) {
            $canStart[$card->id] = $card->canStart;
        }

        [$release, $later] = [
            $this->plans->planCalled('Release')->id,
            $this->plans->planCalled('Later')->id,
        ];

        $this->assertSame([
            true,
            false,
        ], [
            $canStart[$release],
            $canStart[$later],
        ]);
    }

    public function test_a_request_without_an_actor_cannot_start(): void
    {
        $plan = $this->plans->planCalled('Release')->id;

        $this->journal->asGuest()->assertRefused(
            ActorContextMissing::class,
            fn () => $this->journal->runUnkeyed(new StartPlanCommand($plan)),
        );

        $this->plans->assertStatus('Release', PlanStatus::Planned);
    }
}
