<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\ReassignAgentRuntime\ReassignAgentRuntimeCommand;
use App\Enums\Drivers\HoldReason;
use App\Exceptions\DriverRequestRefused;
use App\Models\Agents\AgentRuntime;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * The owner moves a lost runtime to a new process: only a runtime needing attention at the generation read is
 * reassigned, and it starts again as its next generation.
 */
final class ReassignAgentRuntimeTest extends TestCase
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

    public function test_a_runtime_needing_attention_starts_again_as_its_next_generation(): void
    {
        [, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $generation = $runtime->process_generation;
        $reassign = fn (int $expected) => $this->asOwner(new ReassignAgentRuntimeCommand(
            $this->agentIdOf($opened),
            $opened->sessionId,
            $expected,
            null,
            'the host shows no process',
            'the old host went away',
        ));

        $this->assertThrows(fn () => $reassign($generation), DriverRequestRefused::class);
        $runtime->holdFor(HoldReason::NeedsAttention);
        $this->assertThrows(fn () => $reassign($generation + 5), DriverRequestRefused::class);

        $this->assertSame($generation + 1, $reassign($generation));
    }
}
