<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\RecordAgentEffort\RecordAgentEffortCommand;
use App\Events\Sessions\AgentRuntimeEffortApplied;
use App\Models\Agents\AgentRuntime;
use Illuminate\Support\Facades\Event;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * The effort a session's driver applied is recorded on its runtime, so every later start of the runtime runs at it.
 */
#[TestsCommand(RecordAgentEffortCommand::class)]
final class RecordAgentEffortTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;

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

    public function test_the_applied_effort_is_what_the_runtime_starts_at_from_now_on(): void
    {
        Event::fake([AgentRuntimeEffortApplied::class]);
        [, $opened] = $this->openRuntime();

        $this->asOwner(new RecordAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'max'));

        $this->assertSame('max', AgentRuntime::query()->findOrFail($opened->runtimeId)->startEffort());
        Event::assertDispatched(
            AgentRuntimeEffortApplied::class,
            fn (AgentRuntimeEffortApplied $event) => $event->runtimeId === $opened->runtimeId,
        );
    }
}
