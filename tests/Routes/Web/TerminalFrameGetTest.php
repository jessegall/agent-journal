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
 * The owner watching a terminal reads its first frame, or the frames after the one it holds: nothing is sent on.
 */
#[TestsRoute('GET', 'web.terminal-frame')]
final class TerminalFrameGetTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        return RouteCall::recorded('terminal-first-frame', $this->watchedRuntime($journal));
    }

    public function test_the_frames_after_a_held_one_are_read(): void
    {
        $this->assertReachedAndDispatchesItsCommands(
            RouteCall::recorded('terminal-held-frame', $this->watchedRuntime($this->journal)),
        );
    }

    /**
     * The agent and the view of a runtime the owner watches, as a recorded frame read names them.
     *
     * @return array<string, string>
     */
    private function watchedRuntime(TestJournal $journal): array
    {
        $journal->owner();
        $runtime = $this->controllableRuntime();

        return [
            '01JPAGEREQUESTAGENT0000000' => $runtime->session->agent_id,
            'interest-1' => $this->openInterest($runtime),
        ];
    }
}
