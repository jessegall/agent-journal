<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use App\Commands\Terminals\SendTerminalInput\SendTerminalInputCommand;
use App\Enums\Terminals\TerminalInputType;
use App\Enums\Terminals\TerminalNamedKey;
use App\Models\Drivers\TerminalGrant;
use App\Support\TerminalInput;
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
        return $this->inputCall(
            $journal,
            'terminal-control-text-input',
            new TerminalInput('hello', true, 1, 0, TerminalInputType::Text, null, 0, 0),
        );
    }

    public function test_a_named_key_is_sent_as_input(): void
    {
        $this->assertReachedAndDispatchesItsCommands($this->inputCall(
            $this->journal,
            'terminal-control-key-input',
            new TerminalInput('', false, 2, 0, TerminalInputType::Key, TerminalNamedKey::Escape, 0, 0),
        ));
    }

    public function test_a_new_size_is_sent_as_input(): void
    {
        $this->assertReachedAndDispatchesItsCommands($this->inputCall(
            $this->journal,
            'terminal-control-resize-input',
            new TerminalInput('', false, 3, 0, TerminalInputType::Resize, null, 40, 120),
        ));
    }

    /**
     * The recorded input to a runtime the owner holds control of, expecting the one input command it carries.
     */
    private function inputCall(TestJournal $journal, string $recording, TerminalInput $input): RouteCall
    {
        $journal->owner();
        $agentId = $this->grantedRuntime()->session->agent_id;
        $grant = TerminalGrant::query()->acrossActors()->sole();

        return RouteCall::recorded($recording, [
            '01JPAGEREQUESTAGENT0000000' => $agentId,
        ])
            ->reply(SendTerminalInputCommand::class, $grant->id)
            ->expects(SendTerminalInputCommand::class, [
                'agentId' => $agentId,
                'grantId' => self::GRANT,
                'input' => $input,
            ]);
    }
}
