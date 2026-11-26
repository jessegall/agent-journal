<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Models\Drivers\TerminalGrant;
use App\Terminals\Commands\CancelPrivateEntry\CancelPrivateEntryCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The holder of a terminal's control cancels the private entry it opened.
 */
#[TestsRoute('POST', 'web.cancel-private-entry')]
final class CancelPrivateEntryPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $agentId = $this->grantedRuntime()->session->agent_id;
        $grant = TerminalGrant::query()->acrossActors()->sole();

        return RouteCall::recorded('terminal-control-cancel-private', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
        ])
            ->reply(CancelPrivateEntryCommand::class, $grant->id)
            ->expects(CancelPrivateEntryCommand::class, [
                'agentId' => $agentId,
                'grantId' => self::GRANT,
            ]);
    }
}
