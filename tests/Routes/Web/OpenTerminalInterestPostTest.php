<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Models\Drivers\TerminalView;
use App\Terminals\Commands\OpenTerminalView\OpenTerminalViewCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The owner starts watching an agent's terminal.
 */
#[TestsRoute('POST', 'web.open-terminal-interest')]
final class OpenTerminalInterestPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $runtime = $this->controllableRuntime();
        $agentId = $runtime->session->agent_id;
        $interest = $this->openInterest($runtime);

        return RouteCall::recorded('terminal-open', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
            'interest-1' => $interest,
        ])
            ->reply(OpenTerminalViewCommand::class, TerminalView::query()->acrossActors()->sole()->id)
            ->expects(OpenTerminalViewCommand::class, [
                'agentId' => $agentId,
                'openRequestId' => 'request-1',
            ]);
    }
}
