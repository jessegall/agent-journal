<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Models\Drivers\TerminalView;
use App\Terminals\Commands\RenewTerminalView\RenewTerminalViewCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The owner keeps watching an agent's terminal a while longer.
 */
#[TestsRoute('POST', 'web.renew-terminal-interest')]
final class RenewTerminalInterestPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $runtime = $this->controllableRuntime();
        $agentId = $runtime->session->agent_id;
        $interest = $this->openInterest($runtime);

        return RouteCall::recorded('terminal-renew', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
            'interest-1' => $interest,
        ])
            ->reply(RenewTerminalViewCommand::class, TerminalView::query()->acrossActors()->sole()->id)
            ->expects(RenewTerminalViewCommand::class, [
                'agentId' => $agentId,
                'readInterestId' => $interest,
            ]);
    }
}
