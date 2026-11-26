<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Agents\Commands\WakeAgent\WakeAgentCommand;
use App\Agents\Drivers\Commands\AcknowledgeWake\AcknowledgeWakeCommand;
use App\Agents\Drivers\Commands\NotifyRuntimeActivity\NotifyRuntimeActivityCommand;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Models\Drivers\DriverRequest;
use App\Processes\Enums\RuntimeActivity;
use Carbon\CarbonImmutable;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A hook call of a session acknowledges the wake the host claimed, inside the command as the running app requires of
 * every write: only the claimed wake, and nothing from activity before the wake was taken.
 */
#[TestsCommand(AcknowledgeWakeCommand::class)]
final class AcknowledgeWakeTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;

    protected const array TABLES = [
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

    public function test_session_activity_acknowledges_only_the_claimed_wake_and_a_later_one_stays_pending(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->journal->asSystem(
            new NotifyRuntimeActivityCommand(
                $host->hostId,
                $opened->runtimeId,
                RuntimeActivity::Running,
                HoldReason::None,
                1,
            ),
        );
        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-2'));

        $this->journal->asSystem(new AcknowledgeWakeCommand($opened->sessionId));

        $wake = DriverRequest::query()->where('operation', DriverOperation::Wake)->sole();
        $this->assertSame(
            [1, 2, RequestProgress::Accepted],
            [$wake->wake_acknowledged, $wake->wake_requested, $wake->progress],
        );

        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $this->journal->asSystem(new AcknowledgeWakeCommand($opened->sessionId));

        $wake->refresh();
        $this->assertSame([2, RequestProgress::Applied], [$wake->wake_acknowledged, $wake->progress]);
        $this->assertNull($wake->outcome);
    }

    public function test_activity_from_before_the_wake_was_taken_acknowledges_nothing(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->journal->asSystem(
            new NotifyRuntimeActivityCommand(
                $host->hostId,
                $opened->runtimeId,
                RuntimeActivity::Running,
                HoldReason::None,
                1,
            ),
        );
        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));
        $this->journal->claimRequestsOnHost($host->hostId, 10);

        $this->journal->useServerClockAt(CarbonImmutable::now()->subMinute());
        $this->journal->asSystem(new AcknowledgeWakeCommand($opened->sessionId));

        $wake = DriverRequest::query()->where('operation', DriverOperation::Wake)->sole();
        $this->assertSame([0, RequestProgress::Staged], [$wake->wake_acknowledged, $wake->progress]);
    }
}
