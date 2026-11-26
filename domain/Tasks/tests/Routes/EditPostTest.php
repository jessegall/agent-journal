<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Routes;

use Domain\Tasks\Commands\EditTask\EditTaskCommand;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent changes a task's title at the revision it read.
 */
#[TestsRoute('POST', 'tasks.edit')]
final class EditPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Builder');
        $task = $journal->fixtures(TaskFixtures::class)->createTask('Ship the dock');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'task_id' => $task->id,
                'expected_revision' => 1,
                'title' => 'Ship the dock today',
                'brief' => null,
                'request_key' => 'tasks-1',
            ])
            ->reply(EditTaskCommand::class, 2)
            ->expects(EditTaskCommand::class, [
                'taskId' => $task->id,
                'expectedRevision' => 1,
                'title' => 'Ship the dock today',
            ]);
    }
}
