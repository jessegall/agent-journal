<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\RecordAgentModel\RecordAgentModelCommand;
use App\Events\Sessions\AgentRuntimeModelApplied;
use App\Models\Agents\AgentRuntime;
use Illuminate\Support\Facades\Event;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * The model a session's driver applied is recorded on its runtime, so every later start of the runtime runs at it.
 */
#[TestsCommand(RecordAgentModelCommand::class)]
final class RecordAgentModelTest extends TestCase
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

    public function test_the_applied_model_is_what_the_runtime_starts_at_from_now_on(): void
    {
        Event::fake([AgentRuntimeModelApplied::class]);
        [, $opened] = $this->openRuntime();

        $this->asOwner(new RecordAgentModelCommand($this->agentIdOf($opened), $opened->sessionId, 'claude-opus-5-5'));

        $this->assertSame('claude-opus-5-5', AgentRuntime::query()->findOrFail($opened->runtimeId)->startModel());
        Event::assertDispatched(
            AgentRuntimeModelApplied::class,
            fn (AgentRuntimeModelApplied $event) => $event->runtimeId === $opened->runtimeId,
        );
    }
}
