<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Agents\Drivers\Enums\DriverOperation;
use App\Models\Drivers\TerminalGrant;
use App\Models\Projects\Host;
use App\Terminals\Commands\CancelTerminalTake\CancelTerminalTakeCommand;
use App\Terminals\Commands\TakeTerminalControl\TakeTerminalControlCommand;
use App\Terminals\Enums\TerminalGrantStatus;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Terminals\TakesTerminalControl;
use Tests\TestCase;

/**
 * A viewer cancels a take the host has not answered yet, which asks the host once to cancel it.
 */
#[TestsCommand(CancelTerminalTakeCommand::class)]
final class CancelTerminalTakeTest extends TestCase
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

    public function test_an_unanswered_take_is_cancelled_once(): void
    {
        $runtime = $this->controllableRuntime();
        $agentId = $runtime->session->agent_id;
        $this->asOwner(new TakeTerminalControlCommand($agentId, $this->openInterest($runtime), 'take-1'));

        $this->asOwner(new CancelTerminalTakeCommand($agentId, 'take-1'));
        $this->asOwner(new CancelTerminalTakeCommand($agentId, 'take-1'));

        $this->assertSame(TerminalGrantStatus::Releasing, TerminalGrant::query()->acrossActors()->sole()->status);
        $this->assertSame(1, $this->sentCount(DriverOperation::CancelTake));
    }
}
