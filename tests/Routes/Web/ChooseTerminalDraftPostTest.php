<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Models\Drivers\TerminalGrant;
use App\Terminals\Commands\ChooseTerminalDraft\ChooseTerminalDraftCommand;
use App\Terminals\Enums\TerminalDraftChoice;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The holder of a terminal's control chooses what becomes of the draft on the screen.
 */
#[TestsRoute('POST', 'web.choose-terminal-draft')]
final class ChooseTerminalDraftPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $agentId = $this->grantedRuntime()->session->agent_id;
        $grant = TerminalGrant::query()->acrossActors()->sole();

        return RouteCall::recorded('terminal-control-choose-draft', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
        ])
            ->reply(ChooseTerminalDraftCommand::class, $grant->id)
            ->expects(ChooseTerminalDraftCommand::class, [
                'agentId' => $agentId,
                'grantId' => self::GRANT,
                'choice' => TerminalDraftChoice::Send,
                'sequence' => 4,
            ]);
    }
}
