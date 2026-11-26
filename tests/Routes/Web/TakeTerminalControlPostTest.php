<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

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
 * The owner watching a terminal asks to take its control.
 */
#[TestsRoute('POST', 'web.take-terminal-control')]
final class TakeTerminalControlPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $runtime = $this->controllableRuntime();
        $agentId = $runtime->session->agent_id;
        $interest = $this->openInterest($runtime);
        $this->asOwner(new TakeTerminalControlCommand($agentId, $interest, (string) Str::ulid()));
        $grant = TerminalGrant::query()->acrossActors()->sole();

        return RouteCall::recorded('terminal-control-take', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
            'interest-1' => $interest,
        ])
            ->reply(TakeTerminalControlCommand::class, $grant->id)
            ->expects(TakeTerminalControlCommand::class, [
                'agentId' => $agentId,
                'readInterestId' => $interest,
                'takeId' => 'take-1',
            ]);
    }
}
