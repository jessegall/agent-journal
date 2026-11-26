<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Agents\Drivers\Enums\DriverOperation;
use App\Models\Drivers\TerminalGrant;
use App\Models\Projects\Host;
use App\Terminals\Commands\ReleaseTerminalControl\ReleaseTerminalControlCommand;
use App\Terminals\Enums\TerminalGrantStatus;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Terminals\TakesTerminalControl;
use Tests\TestCase;

/**
 * The holder gives control back, which asks the host once to release it; a grant already given back asks nothing more.
 */
#[TestsCommand(ReleaseTerminalControlCommand::class)]
final class ReleaseTerminalControlTest extends TestCase
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

    public function test_control_is_given_back_once(): void
    {
        $agentId = $this->grantedRuntime()->session->agent_id;

        $this->asOwner(new ReleaseTerminalControlCommand($agentId, self::GRANT));
        $this->asOwner(new ReleaseTerminalControlCommand($agentId, self::GRANT));

        $this->assertSame(TerminalGrantStatus::Releasing, TerminalGrant::query()->acrossActors()->sole()->status);
        $this->assertSame(1, $this->sentCount(DriverOperation::ReleaseControl));
    }
}
