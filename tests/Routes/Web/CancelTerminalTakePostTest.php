<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Commands\Terminals\CancelTerminalTake\CancelTerminalTakeCommand;
use App\Commands\Terminals\TakeTerminalControl\TakeTerminalControlCommand;
use App\Models\Drivers\TerminalGrant;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The owner cancels a take of a terminal's control that is still waiting on the host.
 */
#[TestsRoute('POST', 'web.cancel-terminal-take')]
final class CancelTerminalTakePostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $runtime = $this->controllableRuntime();
        $agentId = $runtime->session->agent_id;
        $takeId = (string) Str::ulid();
        $this->asOwner(new TakeTerminalControlCommand($agentId, $this->openInterest($runtime), $takeId));
        $grant = TerminalGrant::query()->acrossActors()->sole();

        return RouteCall::recorded('terminal-control-cancel-take', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
            'take-1' => $takeId,
        ])
            ->reply(CancelTerminalTakeCommand::class, $grant->id)
            ->expects(CancelTerminalTakeCommand::class, [
                'agentId' => $agentId,
                'takeId' => $takeId,
            ]);
    }
}
