<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Models\Drivers\TerminalGrant;
use App\Terminals\Commands\ReleaseTerminalControl\ReleaseTerminalControlCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The holder of a terminal's control gives it back.
 */
#[TestsRoute('POST', 'web.release-terminal-control')]
final class ReleaseTerminalControlPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $agentId = $this->grantedRuntime()->session->agent_id;
        $grant = TerminalGrant::query()->acrossActors()->sole();

        return RouteCall::recorded('terminal-control-release', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
        ])
            ->reply(ReleaseTerminalControlCommand::class, $grant->id)
            ->expects(ReleaseTerminalControlCommand::class, [
                'agentId' => $agentId,
                'grantId' => self::GRANT,
            ]);
    }
}
