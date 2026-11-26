<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Routes;

use Domain\Tasks\Commands\AddTaskWait\AddTaskWaitCommand;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner makes a task wait on another task.
 */
#[TestsRoute('POST', 'tasks.add-wait')]
final class AddWaitPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $tasks = $journal->owner()->fixtures(TaskFixtures::class);
        $task = $tasks->createTask('Ship the dock');
        $prerequisite = $tasks->createTask('Review the dock');

        return RouteCall::as(Caller::User)
            ->parameters([
                'task' => $task->number,
            ])
            ->headers([
                'Idempotency-Key' => 'wait-1',
            ])
            ->payload([
                'prerequisite' => (string) $prerequisite->number,
            ])
            ->reply(AddTaskWaitCommand::class, Str::ulid())
            ->expects(AddTaskWaitCommand::class, [
                'dependentTaskId' => $task->id,
                'prerequisiteTaskId' => $prerequisite->id,
            ]);
    }
}
