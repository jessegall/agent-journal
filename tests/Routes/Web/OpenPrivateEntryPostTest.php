<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Models\Drivers\TerminalGrant;
use App\Terminals\Commands\OpenPrivateEntry\OpenPrivateEntryCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The holder of a terminal's control opens a private entry, typed past the journal's records.
 */
#[TestsRoute('POST', 'web.open-private-entry')]
final class OpenPrivateEntryPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $agentId = $this->grantedRuntime()->session->agent_id;
        $grant = TerminalGrant::query()->acrossActors()->sole();

        return RouteCall::recorded('terminal-control-open-private', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
        ])
            ->reply(OpenPrivateEntryCommand::class, $grant->id)
            ->expects(OpenPrivateEntryCommand::class, [
                'agentId' => $agentId,
                'grantId' => self::GRANT,
                'sequence' => 5,
            ]);
    }
}
