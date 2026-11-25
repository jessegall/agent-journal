<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Commands\Terminals\ChooseTerminalDraft\ChooseTerminalDraftCommand;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Terminals\TerminalDraftChoice;
use App\Exceptions\TerminalControlRefused;
use App\Models\Projects\Host;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Terminals\TakesTerminalControl;
use Tests\TestCase;

/**
 * The holder chooses what happens to a draft at the next sequence, which goes to the host; a choice out of sequence is
 * refused naming the expected one.
 */
final class ChooseTerminalDraftTest extends TestCase
{
    use CommitsHookRows;
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'terminal_views',
        'terminal_grants',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_choice_at_the_next_sequence_goes_to_the_host_and_a_gap_is_refused(): void
    {
        $agentId = $this->grantedRuntime()->session->agent_id;

        $this->asOwner(new ChooseTerminalDraftCommand($agentId, self::GRANT, TerminalDraftChoice::Send, 1));

        $this->assertThrows(
            fn () => $this->asOwner(
                new ChooseTerminalDraftCommand($agentId, self::GRANT, TerminalDraftChoice::Send, 5),
            ),
            TerminalControlRefused::class,
        );
        $this->assertSame(1, $this->sentCount(DriverOperation::DraftChoice));
    }
}
