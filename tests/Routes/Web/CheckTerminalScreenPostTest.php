<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Models\Drivers\TerminalGrant;
use App\Terminals\Commands\CheckTerminalScreen\CheckTerminalScreenCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The holder of a terminal's control asks the host to check the screen again.
 */
#[TestsRoute('POST', 'web.check-terminal-screen')]
final class CheckTerminalScreenPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $agentId = $this->grantedRuntime()->session->agent_id;
        $grant = TerminalGrant::query()->acrossActors()->sole();

        return RouteCall::recorded('terminal-control-check-screen', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
        ])
            ->reply(CheckTerminalScreenCommand::class, $grant->id)
            ->expects(CheckTerminalScreenCommand::class, [
                'agentId' => $agentId,
                'grantId' => self::GRANT,
            ]);
    }
}
