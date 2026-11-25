<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Commands\Terminals\CheckTerminalScreen\CheckTerminalScreenCommand;
use App\Enums\Drivers\DriverOperation;
use App\Models\Projects\Host;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\Terminals\TakesTerminalControl;
use Tests\TestCase;

/**
 * The holder asks the host to check the screen again.
 */
final class CheckTerminalScreenTest extends TestCase
{
    use CommitsHookRows;
    use OpensTerminalRuntimes;
    use RunsTrustedCommands;
    use SendsHostCalls;
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

    public function test_the_host_is_asked_to_check_the_screen(): void
    {
        $agentId = $this->grantedRuntime()->session->agent_id;

        $this->asOwner(new CheckTerminalScreenCommand($agentId, self::GRANT));

        $this->assertSame(1, $this->sentCount(DriverOperation::CheckScreen));
    }
}
