<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The owner opens an agent's terminal window.
 */
#[TestsRoute('GET', 'web.terminal')]
final class TerminalGetTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User)->parameters([
            'agent' => $this->controllableRuntime()->session->agent_id,
        ]);
    }
}
