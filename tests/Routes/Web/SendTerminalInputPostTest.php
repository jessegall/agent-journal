<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Models\Drivers\TerminalGrant;
use App\Terminals\Commands\SendTerminalInput\SendTerminalInputCommand;
use App\Terminals\Enums\TerminalInputType;
use App\Terminals\Enums\TerminalNamedKey;
use App\Terminals\TerminalInput;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Terminals\TakesTerminalControl;

/**
 * The holder of a terminal's control types a line into it, presses a named key, or gives it a new size.
 */
#[TestsRoute('POST', 'web.send-terminal-input')]
final class SendTerminalInputPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    protected function arrange(TestJournal $journal): RouteCall
    {
        return $this->expectingInput(
            RouteCall::recorded('terminal-control-text-input', $this->grantedAgent($journal)),
            new TerminalInput('hello', true, 1, 0, TerminalInputType::Text, null, 0, 0),
        );
    }

    public function test_a_named_key_is_sent_as_input(): void
    {
        $this->assertReachedAndDispatchesItsCommands($this->expectingInput(
            RouteCall::recorded('terminal-control-key-input', $this->grantedAgent($this->journal)),
            new TerminalInput('', false, 2, 0, TerminalInputType::Key, TerminalNamedKey::Escape, 0, 0),
        ));
    }

    public function test_a_new_size_is_sent_as_input(): void
    {
        $this->assertReachedAndDispatchesItsCommands($this->expectingInput(
            RouteCall::recorded('terminal-control-resize-input', $this->grantedAgent($this->journal)),
            new TerminalInput('', false, 3, 0, TerminalInputType::Resize, null, 40, 120),
        ));
    }

    /**
     * The owner holds control of a runtime's terminal; the recording's agent is that runtime's.
     *
     * @return array<string, string>
     */
    private function grantedAgent(TestJournal $journal): array
    {
        $journal->owner();

        return ['01JPAGEREQUESTAGENT0000000' => $this->grantedRuntime()->session->agent_id];
    }

    /**
     * The recorded input, expecting the one input command it carries.
     */
    private function expectingInput(RouteCall $call, TerminalInput $input): RouteCall
    {
        $grant = TerminalGrant::query()->acrossActors()->with('runtime.session')->sole();

        return $call
            ->reply(SendTerminalInputCommand::class, $grant->id)
            ->expects(SendTerminalInputCommand::class, [
                'agentId' => $grant->runtime->session->agent_id,
                'grantId' => self::GRANT,
                'input' => $input,
            ]);
    }
}
