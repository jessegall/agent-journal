<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\NotifyRuntimeExit\NotifyRuntimeExitCommand;
use App\Commands\Agents\WakeAgent\WakeAgentCommand;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Sessions\SessionStatus;
use App\Exceptions\DriverRequestRefused;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionProcess;
use App\Support\EnrolledHost;
use App\Support\InitialWakeSettlement;
use App\Support\OpenedRuntime;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * Waking an agent: repeated wakes raise one open wake, a wake after the session ended is refused, a refused message
 * wake keeps the session and its start, a proved unstarted initial wake ends the start once with its reason, and a
 * generic refusal of the initial wake keeps the start for reconciliation.
 */
final class WakeAgentTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use OpensPairChats;
    use RunsTrustedCommands;
    use SendsHostCalls;
    use WritesInboxMessages;

    private const string NO_CONTAINER = 'The host cannot provide a container.';

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
        $claimed = $this->claimedScript($host, $wake->requestId);

        $this->notifyWakeRefused($host, $claimed, 'container-unavailable', true);

        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $this->assertSame(SessionStatus::Active, $session->status);
        $this->assertNull(SessionProcess::findLatestOfSession($opened->sessionId)?->refusal);
        $this->assertSame(RequestProgress::Failed, DriverRequest::query()->findOrFail($wake->requestId)->progress);
    }

    public function test_a_proved_unstarted_initial_wake_ends_the_start_once_with_its_reason(): void
    {
        [$host, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgentCommand(
            $this->agentIdOf($opened),
            $opened->sessionId,
            InitialWakeSettlement::keyOf($opened->sessionId),
        ));
        $claimed = $this->claimedScript($host, $wake->requestId);

        $this->notifyWakeRefused($host, $claimed, 'container-unavailable', true);
        $this->notifyWakeRefused($host, $claimed, 'container-unavailable', true);

        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $start = SessionProcess::findLatestOfSession($opened->sessionId);
        $this->assertSame(SessionStatus::Ended, $session->status);
        $this->assertSame(self::NO_CONTAINER, $start?->refusal);
    }

    public function test_a_generic_refusal_of_the_initial_wake_keeps_the_start_for_reconciliation(): void
    {
        [$host, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgentCommand(
            $this->agentIdOf($opened),
            $opened->sessionId,
            InitialWakeSettlement::keyOf($opened->sessionId),
        ));
        $claimed = $this->claimedScript($host, $wake->requestId);

        $this->notifyWakeRefused($host, $claimed, null, false);

        $this->assertSame(SessionStatus::Active, AgentSession::query()->findOrFail($opened->sessionId)->status);
        $this->assertNull(SessionProcess::findLatestOfSession($opened->sessionId)?->refusal);
    }

    /**
     * The request as the host's claim hands it out.
     *
     * @return array<string, mixed>
     */
    private function claimedScript(EnrolledHost $host, string $requestId): array
    {
        $requests = $this->hostCall(
            $host,
            '/host/claim?limit=10&wait=0&watched_version=0',
        )->assertOk()->json('requests');

        return collect($requests)->firstOrFail(fn (array $claimed) => $claimed['requestId'] === $requestId);
    }

    /**
     * The host refuses a claimed wake, naming a reason and that no process was made only when it knows.
     *
     * @param  array<string, mixed>  $claimed
     */
    private function notifyWakeRefused(
        EnrolledHost $host,
        array $claimed,
        string|null $reason,
        bool $hasCreatedNoProcess,
    ): void {
        $this->hostCall($host, '/host/reports/request', [
            'request_id' => $claimed['requestId'],
            'attempt' => $claimed['attempt'],
            'progress' => 'failed',
            'actual_binding' => null,
            'outcome' => 'refused',
            'refusal_reason' => $reason,
            'has_created_no_process' => $hasCreatedNoProcess,
            'session_id' => $claimed['sessionId'],
            'session_process_id' => $claimed['sessionProcessId'],
            'process_generation' => $claimed['processGeneration'],
        ])->assertSuccessful();
    }

    private function notifyExit(EnrolledHost $host, OpenedRuntime $opened): void
    {
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->asSystem(new NotifyRuntimeExitCommand($host->hostId, $opened->runtimeId, $generation, 'exit code 0'));
    }
}
