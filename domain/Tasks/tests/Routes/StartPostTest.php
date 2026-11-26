<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Routes;

use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner starts a run of a task.
 */
#[TestsRoute('POST', 'tasks.start')]
final class StartPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $task = $journal->owner()->fixtures(TaskFixtures::class)->createTask('Ship the dock');

        return RouteCall::as(Caller::User)
            ->parameters([
                'task' => $task->number,
            ])
            ->reply(StartTaskCommand::class, 1)
            ->expects(StartTaskCommand::class, [
                'taskId' => $task->id,
            ]);
    }
}
