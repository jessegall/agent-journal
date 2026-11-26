<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The owner watching a terminal reads its first frame: nothing is sent on.
 */
#[TestsRoute('GET', 'web.terminal-frame')]
final class TerminalFrameGetTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $runtime = $this->controllableRuntime();

        return RouteCall::recorded('terminal-first-frame', [
            '01JPAGEREQUESTAGENT0000000' => $runtime->session->agent_id,
            'interest-1' => $this->openInterest($runtime),
        ]);
    }
}
