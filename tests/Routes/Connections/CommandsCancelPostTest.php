<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Commands\Projects\CancelProjectCommandRun\CancelProjectCommandRunCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A main agent asks the journal to cancel a project command it started.
 */
#[TestsRoute('POST', 'connections.commands.cancel')]
final class CommandsCancelPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Main');

        return RouteCall::as(Caller::Agent, $start)
            ->parameters([
                'requestKey' => 'run-1',
            ])
            ->expects(CancelProjectCommandRunCommand::class, [
                'requestKey' => 'run-1',
                'agentId' => $start->agent->id,
            ]);
    }
}
