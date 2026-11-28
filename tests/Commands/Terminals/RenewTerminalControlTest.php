<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Agents\Drivers\Enums\DriverOperation;
use App\Models\Drivers\TerminalGrant;
use App\Models\Projects\Host;
use App\Terminals\Commands\RenewTerminalControl\RenewTerminalControlCommand;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Terminals\TakesTerminalControl;
use Tests\TestCase;

/**
 * The holder renews control, which moves the grant's expiry on and tells the host.
 */
#[TestsCommand(RenewTerminalControlCommand::class)]
final class RenewTerminalControlTest extends TestCase
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

    public function test_renewing_moves_the_expiry_on_and_notifies_the_host(): void
    {
        $agentId = $this->grantedRuntime()->session->agent_id;
        $grant = TerminalGrant::query()->acrossActors()->sole();
        $before = $grant->expires_at->subSeconds(10);
        TerminalGrant::query()->acrossActors()->whereKey($grant->id)->update(['expires_at' => $before]);
        $takes = $this->sentCount(DriverOperation::TakeControl);

        $this->asOwner(new RenewTerminalControlCommand($agentId, self::GRANT));

        $this->assertTrue(TerminalGrant::query()->acrossActors()->sole()->expires_at->greaterThan($before));
        $this->assertSame($takes + 1, $this->sentCount(DriverOperation::TakeControl));
    }
}
