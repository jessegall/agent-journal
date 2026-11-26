<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Routes;

use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
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
 * The owner cancels a task at the revision they saw, with a reason.
 */
#[TestsRoute('POST', 'tasks.cancel')]
final class CancelPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $task = $journal->owner()->fixtures(TaskFixtures::class)->createTask('Ship the dock');
        // Only the holder of a run may block or cancel it, so the owner starts the run first.
        $journal->run(new StartTaskCommand($task->id));

        return RouteCall::as(Caller::User)
            ->parameters(['task' => $task->number])
            ->payload(['reason' => 'Not needed.', 'revision' => 1, 'run' => 1])
            ->expects(CancelTaskCommand::class, [
                'taskId' => $task->id,
                'reason' => 'Not needed.',
                'expectedRevision' => 1,
                'expectedRunNumber' => 1,
            ]);
    }
}
