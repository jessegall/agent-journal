<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Models\Drivers\TerminalGrant;
use App\Terminals\Commands\RenewTerminalControl\RenewTerminalControlCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The holder of a terminal's control keeps it a while longer.
 */
#[TestsRoute('POST', 'web.renew-terminal-control')]
final class RenewTerminalControlPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $agentId = $this->grantedRuntime()->session->agent_id;
        $grant = TerminalGrant::query()->acrossActors()->sole();

        return RouteCall::recorded('terminal-control-renew', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
        ])
            ->reply(RenewTerminalControlCommand::class, $grant->id)
            ->expects(RenewTerminalControlCommand::class, [
                'agentId' => $agentId,
                'grantId' => self::GRANT,
            ]);
    }
}
