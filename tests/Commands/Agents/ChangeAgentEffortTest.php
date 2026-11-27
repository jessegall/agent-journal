<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\ChangeAgentEffort\ChangeAgentEffortCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Exceptions\DriverRequestRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A later effort supersedes an earlier one that has not run, and an unknown effort is refused before anything is
 * accepted.
 */
#[TestsCommand(ChangeAgentEffortCommand::class)]
final class ChangeAgentEffortTest extends TestCase
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

    public function test_a_later_effort_supersedes_an_earlier_one_that_has_not_run(): void
    {
        [, $opened] = $this->openRuntime();

        $high = $this->asOwner(
            new ChangeAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'effort-1', 'high'),
        );
        $this->asOwner(new ChangeAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'effort-2', 'low'));

        $this->assertSame(RequestProgress::Superseded, DriverRequest::query()->findOrFail($high->requestId)->progress);
    }

    /**
     * The change's state holds the effort until the driver applied its request; then the runtime runs at it.
     */
    public function test_the_effort_is_recorded_on_the_runtime_only_once_the_driver_applied_it(): void
    {
        [$host, $opened] = $this->openRuntime();
        $change = $this->asOwner(
            new ChangeAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'effort-1', 'max'),
        );
        $waiting = AgentRuntime::query()->findOrFail($opened->runtimeId)->requested_effort;
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $request = DriverRequest::query()->findOrFail($change->requestId);

        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $request->id,
            $request->attempt_version,
            RequestProgress::Applied,
            null,
            null,
        ));

        $this->assertNotSame('max', $waiting);
        $this->assertSame('max', AgentRuntime::query()->findOrFail($opened->runtimeId)->requested_effort);
    }

    public function test_an_unknown_effort_is_refused_before_anything_is_accepted(): void
    {
        [, $opened] = $this->openRuntime();

        try {
            $this->asOwner(
                new ChangeAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'effort-1', 'extreme'),
            );
            $this->fail('An unknown effort was accepted.');
        } catch (DriverRequestRefused) {
            $this->assertSame(0, DriverRequest::query()->where('operation', DriverOperation::ChangeEffort)->count());
        }
    }
}
