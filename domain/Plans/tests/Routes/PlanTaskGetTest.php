<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\Fixtures\TestPhase;
use Domain\Plans\Tests\Fixtures\TestPlan;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens a task of a plan.
 */
#[TestsRoute('GET', 'plans.plan-task')]
final class PlanTaskGetTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $task = $journal->owner()->fixtures(TaskFixtures::class)->createTask('Ship the dock');

        $plans = $journal->fixtures(PlanFixtures::class)
            ->plan('Release')
            ->withPlan('Release', fn (TestPlan $plan) => $plan
                ->addPhase('Working')->withPhase('Working', fn (TestPhase $phase) => $phase
                ->place($task->assignmentIdentity())));

        return RouteCall::as(Caller::User)
            ->parameters(['plan' => $plans->planCalled('Release')->number, 'task' => $task->number]);
    }
}
