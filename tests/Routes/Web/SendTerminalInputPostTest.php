<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Commands\Terminals\SendTerminalInput\SendTerminalInputCommand;
use App\Enums\Terminals\TerminalInputType;
use App\Models\Drivers\TerminalGrant;
use App\Support\TerminalInput;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The holder of a terminal's control types a line into it.
 */
#[TestsRoute('POST', 'web.send-terminal-input')]
final class SendTerminalInputPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $agentId = $this->grantedRuntime()->session->agent_id;
        $grant = TerminalGrant::query()->acrossActors()->sole();

        return RouteCall::recorded('terminal-control-text-input', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
        ])
            ->reply(SendTerminalInputCommand::class, $grant->id)
            ->expects(SendTerminalInputCommand::class, [
                'agentId' => $agentId,
                'grantId' => self::GRANT,
                'input' => new TerminalInput('hello', true, 1, 0, TerminalInputType::Text, null, 0, 0),
            ]);
    }
}
