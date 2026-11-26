<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Commands\Terminals\TakeTerminalControl\TakeTerminalControlCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The owner reads how a take of a terminal's control stands: nothing is sent on.
 */
#[TestsRoute('GET', 'web.terminal-control')]
final class TerminalControlGetTest extends GuardedRouteEntryTestCase
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

        return RouteCall::recorded('terminal-control-receipt', [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
            'take-1' => $takeId,
        ]);
    }
}
