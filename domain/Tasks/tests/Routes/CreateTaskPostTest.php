<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Routes;

use App\Http\Middleware\Web\SelectProject;
use Domain\Tasks\Commands\CreateTask\CreateTaskCommand;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * The owner files a new task and is sent to its page.
 */
#[TestsRoute('POST', 'tasks.create-task')]
final class CreateTaskPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        // The page answers with the new task's address, so the reply is a task that exists.
        $task = $journal->owner()->fixtures(TaskFixtures::class)->createTask('Ship the dock');

        return RouteCall::as(Caller::User)
            ->headers([SelectProject::HEADER => TestProjects::local()->id])
            ->payload(['title' => 'Ship the dock', 'brief' => 'Dock the source beside the chat.'])
            ->reply(CreateTaskCommand::class, $task->id)
            ->expects(CreateTaskCommand::class, [
                'title' => 'Ship the dock',
                'brief' => 'Dock the source beside the chat.',
            ]);
    }
}
