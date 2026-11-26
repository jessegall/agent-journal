<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Terminals\Commands\CloseTerminalView\CloseTerminalViewCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The owner stops watching an agent's terminal.
 */
#[TestsRoute('POST', 'web.close-terminal-interest')]
final class CloseTerminalInterestPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $runtime = $this->controllableRuntime();
        $agentId = $runtime->session->agent_id;
        $interest = $this->openInterest($runtime);

        return RouteCall::recorded('terminal-close', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
            'interest-1' => $interest,
        ])
            ->expects(CloseTerminalViewCommand::class, [
                'agentId' => $agentId,
                'readInterestId' => $interest,
            ]);
    }
}
