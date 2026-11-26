<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\ChangeAgentEffort\ChangeAgentEffortCommand;
use App\Commands\Agents\RepairDriverSettings\RepairDriverSettingsCommand;
use App\Commands\Drivers\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Enums\Drivers\RequestOutcome;
use App\Enums\Drivers\RequestProgress;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * The owner repairs a failed effort change, which is repaired in its own place in the queue.
 */
#[TestsCommand(RepairDriverSettingsCommand::class)]
final class RepairDriverSettingsTest extends TestCase
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

    public function test_a_failed_effort_change_is_repaired_in_its_own_place_in_the_queue(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $effort = $this->asOwner(new ChangeAgentEffortCommand($agentId, $opened->sessionId, 'effort-1', 'high'));
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $request = DriverRequest::query()->findOrFail($effort->requestId);
        $attempt = $request->attempt_version;
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $request->id,
            $attempt,
            RequestProgress::Failed,
            null,
            RequestOutcome::Refused,
        ));
        $request->refresh();
        $sequence = $request->sequence;

        $this->asOwner(
            new RepairDriverSettingsCommand($request->id, $request->row_version, 'low', 'high is not offered'),
        );

        $request->refresh();
        $this->assertSame([RequestProgress::Accepted, 'low'], [$request->progress, $request->effort]);
        $this->assertSame([$sequence, $attempt + 1], [$request->sequence, $request->attempt_version]);
        $this->assertSame('low', AgentRuntime::query()->findOrFail($opened->runtimeId)->requested_effort);
    }
}
