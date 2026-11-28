<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\NotifyRuntimeExit\NotifyRuntimeExitCommand;
use App\Agents\Commands\WakeAgent\WakeAgentCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\HostWakeRefusal;
use App\Agents\Drivers\Enums\RequestOutcome;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Drivers\Values\RequestReportBinding;
use App\Exceptions\DriverRequestRefused;
use App\Hosts\EnrolledHost;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionProcess;
use App\Sessions\Enums\SessionStatus;
use App\Sessions\InitialWakeSettlement;
use App\Sessions\OpenedRuntime;
use App\Values\ClaimedRequest;
use App\Values\RetrySchedule;
use Carbon\CarbonImmutable;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * Waking an agent: repeated wakes raise one open wake, a wake after the session ended is refused, a refused message
 * wake keeps the session and its start, a proved unstarted initial wake ends the start once with its reason, and a
 * generic refusal of the initial wake keeps the start for reconciliation.
 */
#[TestsCommand(WakeAgentCommand::class)]
final class WakeAgentTest extends TestCase
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

    public function test_repeated_wakes_raise_one_open_wake(): void
    {
        [, $opened] = $this->openRuntime();

        $first = $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));
        $second = $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-2'));

        $this->assertSame($first->requestId, $second->requestId);
        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::Wake)->count());
        $this->assertSame(2, DriverRequest::query()->findOrFail($first->requestId)->wake_requested);
    }

    public function test_a_wake_after_the_session_ended_is_refused(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->notifyExit($host, $opened);

        $this->expectException(DriverRequestRefused::class);

        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-after-exit'));
    }

    public function test_a_refused_message_wake_keeps_the_session_its_credentials_and_its_start(): void
    {
        [$host, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'message-wake'));
        $claimed = $this->journal->claimedRequestOnHost($host->hostId, $wake->requestId);

        $this->notifyWakeRefused($host, $claimed, HostWakeRefusal::ContainerUnavailable, false);

        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $this->assertSame(SessionStatus::Active, $session->status);
        $this->assertNull(SessionProcess::findLatestOfSession($opened->sessionId)?->refusal);
        $this->assertSame(RequestProgress::Failed, DriverRequest::query()->findOrFail($wake->requestId)->progress);
    }

    public function test_a_proved_unstarted_initial_wake_ends_the_start_once_with_its_reason(): void
    {
        $now = CarbonImmutable::now();
        $this->journal->useServerClockAt($now);
        [$host, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgentCommand(
            $this->agentIdOf($opened),
            $opened->sessionId,
            InitialWakeSettlement::keyOf($opened->sessionId),
        ));
        $claimed = $this->journal->claimedRequestOnHost($host->hostId, $wake->requestId);

        $reason = HostWakeRefusal::ContainerUnavailable;

        for ($retry = 1; $retry <= RetrySchedule::RETRY_LIMIT; $retry++) {
            $this->notifyWakeRefused($host, $claimed, $reason, true);
            $now = $now->addSeconds(RetrySchedule::waitBefore($retry));
            $this->journal->moveServerClockTo($now);
            $claimed = $this->journal->claimedRequestOnHost($host->hostId, $wake->requestId);
        }

        $this->notifyWakeRefused($host, $claimed, $reason, true);
        $this->notifyWakeRefused($host, $claimed, $reason, true);

        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $start = SessionProcess::findLatestOfSession($opened->sessionId);
        $this->assertSame(SessionStatus::Ended, $session->status);
        $this->assertSame($reason->startReason()->explanation(), $start?->refusal);
    }

    public function test_a_generic_refusal_of_the_initial_wake_keeps_the_start_for_reconciliation(): void
    {
        [$host, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgentCommand(
            $this->agentIdOf($opened),
            $opened->sessionId,
            InitialWakeSettlement::keyOf($opened->sessionId),
        ));
        $claimed = $this->journal->claimedRequestOnHost($host->hostId, $wake->requestId);

        $this->notifyWakeRefused($host, $claimed, null, false);

        $this->assertSame(SessionStatus::Active, AgentSession::query()->findOrFail($opened->sessionId)->status);
        $this->assertNull(SessionProcess::findLatestOfSession($opened->sessionId)?->refusal);
    }

    /**
     * The host refuses a claimed wake, naming a reason and that no process was made only when it knows.
     */
    private function notifyWakeRefused(
        EnrolledHost $host,
        ClaimedRequest $claimed,
        HostWakeRefusal|null $refusal,
        bool $hasCreatedNoProcess,
    ): void {
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $claimed->requestId,
            $claimed->attempt,
            RequestProgress::Failed,
            null,
            RequestOutcome::Refused,
            refusal: $refusal,
            hasCreatedNoProcess: $hasCreatedNoProcess,
            binding: new RequestReportBinding(
                $claimed->sessionId,
                $claimed->sessionProcessId,
                $claimed->processGeneration,
            ),
        ));
    }

    private function notifyExit(EnrolledHost $host, OpenedRuntime $opened): void
    {
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->journal->asSystem(
            new NotifyRuntimeExitCommand($host->hostId, $opened->runtimeId, $generation, 'exit code 0'),
        );
    }
}
