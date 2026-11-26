<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Routes;

use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
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
 * The owner blocks a task's run with a reason.
 */
#[TestsRoute('POST', 'tasks.block')]
final class BlockPostTest extends GuardedRouteEntryTestCase
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
            ->parameters([
                'task' => $task->number,
            ])
            ->payload([
                'reason' => 'Waits on the review.',
                'run' => 1,
            ])
            ->expects(BlockTaskCommand::class, [
                'taskId' => $task->id,
                'runNumber' => 1,
                'reason' => 'Waits on the review.',
            ]);
    }
}
