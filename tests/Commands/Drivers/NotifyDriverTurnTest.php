<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Drivers\NotifyDriverTurn\NotifyDriverTurnCommand;
use App\Enums\Runs\RuntimeActivity;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverTurn;
use App\Models\Projects\Host;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A host reports a turn: a started turn runs and a finished one leaves the runtime idle.
 */
#[TestsCommand(NotifyDriverTurnCommand::class)]
final class NotifyDriverTurnTest extends TestCase
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

    public function test_a_started_turn_runs_and_a_finished_one_leaves_the_runtime_idle(): void
    {
        [$host, $opened] = $this->openRuntime();

        $this->journal->asSystem(
            new NotifyDriverTurnCommand($host->hostId, $opened->runtimeId, 1, 'prompt-1', false, 'opus', 'high', null),
        );
        $this->assertSame(RuntimeActivity::Running, AgentRuntime::query()->findOrFail($opened->runtimeId)->activity);

        $this->journal->asSystem(
            new NotifyDriverTurnCommand(
                $host->hostId,
                $opened->runtimeId,
                1,
                'prompt-1',
                true,
                'opus',
                'high',
                'finished',
            ),
        );

        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame(RuntimeActivity::Idle, $runtime->activity);
        $this->assertSame('high', $runtime->observed_effort);
        $this->assertSame(1, DriverTurn::query()->where('agent_runtime_id', $opened->runtimeId)->count());
    }
}
