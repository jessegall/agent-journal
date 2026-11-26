<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Routes;

use Domain\Tasks\Commands\CreateTask\CreateTaskCommand;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent files a new task.
 */
#[TestsRoute('POST', 'tasks.create')]
final class CreatePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Builder');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'title' => 'Ship the dock',
                'brief' => 'Dock the source beside the chat.',
                'request_key' => 'tasks-1',
            ])
            ->reply(CreateTaskCommand::class, Str::ulid())
            ->expects(CreateTaskCommand::class, [
                'title' => 'Ship the dock',
                'brief' => 'Dock the source beside the chat.',
            ]);
    }
}
