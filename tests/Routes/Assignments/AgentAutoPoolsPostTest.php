<?php

declare(strict_types=1);

namespace Tests\Routes\Assignments;

use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent lists the pools tasks can be taken from: nothing is sent on.
 */
#[TestsRoute('POST', 'assignments.agent.auto.pools')]
final class AgentAutoPoolsPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $start = $journal->signedStart('Planner');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'assignable_type' => 'tasks.task',
            ]);
    }
}
