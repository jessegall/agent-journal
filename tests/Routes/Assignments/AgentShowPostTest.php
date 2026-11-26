<?php

declare(strict_types=1);

namespace Tests\Routes\Assignments;

use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads who holds a task: nothing is sent on.
 */
#[TestsRoute('POST', 'assignments.agent.show')]
final class AgentShowPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $task = $journal->fixtures(TaskFixtures::class)->createTask('Ship the dock');
        $start = $journal->signedStart('Planner');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'record_type' => 'tasks.task',
                'record_id' => $task->id,
            ]);
    }
}
