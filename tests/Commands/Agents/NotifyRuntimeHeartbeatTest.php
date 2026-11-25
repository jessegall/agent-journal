<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\NotifyRuntimeHeartbeat\NotifyRuntimeHeartbeatCommand;
use App\Exceptions\HostReportRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * A heartbeat of the current generation refreshes the session; one of a restarted program is taken and one of a
 * replaced generation is refused.
 */
final class NotifyRuntimeHeartbeatTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use OpensPairChats;
    use RunsTrustedCommands;
    use SendsHostCalls;
    use WritesInboxMessages;

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
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
    ];

    public function test_a_heartbeat_of_the_current_generation_refreshes_the_session(): void
    {
        [$host, $opened] = $this->openRuntime();
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->asSystem(
            new NotifyRuntimeHeartbeatCommand($host->hostId, $opened->runtimeId, $generation, 'owned process alive'),
        );

        $this->assertNotNull(AgentSession::query()->findOrFail($opened->sessionId)->last_heartbeat_at);
    }

    public function test_a_heartbeat_of_a_restarted_program_is_taken_and_one_of_a_replaced_generation_is_refused(): void
    {
        [$host, $opened] = $this->openRuntime();
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->asSystem(new NotifyRuntimeHeartbeatCommand($host->hostId, $opened->runtimeId, $generation + 1, 'restarted'));

        $this->assertNotNull(AgentSession::query()->findOrFail($opened->sessionId)->last_heartbeat_at);
        $this->assertThrows(
            fn () => $this->asSystem(
                new NotifyRuntimeHeartbeatCommand($host->hostId, $opened->runtimeId, $generation - 1, 'replaced'),
            ),
            HostReportRefused::class,
        );
    }
}
