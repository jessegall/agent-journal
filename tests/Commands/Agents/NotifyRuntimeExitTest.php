<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Commands\NotifyRuntimeExit\NotifyRuntimeExitCommand;
use App\Agents\Commands\RetireAgent\RetireAgentCommand;
use App\Agents\Commands\StopAgent\StopAgentCommand;
use App\Agents\DriverRequestEndings;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Hosts\EnrolledHost;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Navigation\Enums\NavigationStatus;
use App\Processes\Enums\RuntimeActivity;
use App\Sessions\Enums\SessionStatus;
use App\Sessions\OpenedRuntime;
use App\Values\DriverReceipt;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\Engine\RunsEnginePasses;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A verified exit ends the session, a confirmed stop ends and revokes it with no request left open, and retiring an
 * agent with a running runtime stops it through its host.
 */
#[TestsCommand(NotifyRuntimeExitCommand::class)]
final class NotifyRuntimeExitTest extends TestCase
{
    use CommitsHookRows;
    use RaisesNavigationRequests;
    use RunsEnginePasses;

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
        'navigation_requests',
    ];

    public function test_a_verified_exit_ends_the_session(): void
    {
        [$host, $opened] = $this->openRuntime();
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->journal->asSystem(
            new NotifyRuntimeExitCommand($host->hostId, $opened->runtimeId, $generation, 'exit code 0'),
        );

        $this->assertSame(SessionStatus::Ended, AgentSession::query()->findOrFail($opened->sessionId)->status);
    }

    /**
     * The host reports an exit once the session already ended, as when its stop ended it on that very exit: the report
     * is taken and the end stays as it was recorded, so the host's later reports are not held behind a refusal.
     */
    public function test_an_exit_after_the_session_ended_is_taken_and_changes_nothing(): void
    {
        [$host, $opened] = $this->openRuntime();
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;
        $exit = new NotifyRuntimeExitCommand($host->hostId, $opened->runtimeId, $generation, 'exit code 0');
        $this->journal->asSystem($exit);
        $ended = AgentSession::query()->findOrFail($opened->sessionId);

        $this->journal->asSystem($exit);

        $this->assertEquals($ended->ended_at, AgentSession::query()->findOrFail($opened->sessionId)->ended_at);
    }

    public function test_a_confirmed_stop_ends_the_session_revokes_it_and_leaves_no_request_open(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->deliver($opened, 'before-stop', 'Never delivered');
        $this->asOwner(new StopAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'stop-1'));

        $this->notifyExit($host, $opened);

        $session = AgentSession::query()->with('sessionToken')->findOrFail($opened->sessionId);
        $requests = DriverRequest::query()->where('agent_runtime_id', $opened->runtimeId)->get();
        $this->assertSame(SessionStatus::Ended, $session->status);
        $this->assertTrue($session->sessionToken?->isRevoked());
        $this->assertSame(RuntimeActivity::Stopped, AgentRuntime::query()->findOrFail($opened->runtimeId)->activity);
        $this->assertTrue($requests->every(fn (DriverRequest $request) => $request->progress->isFinal()));
        $progress = $requests->mapWithKeys(
            fn (DriverRequest $request) => [$request->operation->value => $request->progress],
        );
        $this->assertSame(RequestProgress::Applied, $progress[DriverOperation::Stop->value]);
        $this->assertSame(RequestProgress::Unavailable, $progress[DriverOperation::Deliver->value]);
    }

    public function test_retiring_an_agent_with_a_running_runtime_stops_it_through_its_host(): void
    {
        [$host, $opened] = $this->openRuntime();

        $this->asOwner(new RetireAgentCommand($this->agentIdOf($opened)));

        $stop = DriverRequest::query()->where('agent_runtime_id', $opened->runtimeId)
            ->where('operation', DriverOperation::Stop)->sole();
        $this->assertSame(RuntimeActivity::Stopping, AgentRuntime::query()->findOrFail($opened->runtimeId)->activity);
        $this->assertSame(SessionStatus::Active, AgentSession::query()->findOrFail($opened->sessionId)->status);
        $this->assertFalse($stop->progress->isFinal());

        $this->notifyExit($host, $opened);

        $this->assertSame(SessionStatus::Ended, AgentSession::query()->findOrFail($opened->sessionId)->status);
        $this->assertSame(RequestProgress::Applied, $stop->fresh()?->progress);
    }

    public function test_a_runtime_that_ends_cancels_the_request_of_its_key_script(): void
    {
        $stalled = $this->stalledScript();
        $navigation = $this->raise($stalled, 'raise-1');

        $this->app->make(DriverRequestEndings::class)->closeAfterExit(
            AgentRuntime::query()->findOrFail($stalled->agent_runtime_id),
        );

        $this->assertSame(NavigationStatus::Cancelled, $navigation->fresh()?->status);
    }

    private function notifyExit(EnrolledHost $host, OpenedRuntime $opened): void
    {
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->journal->asSystem(
            new NotifyRuntimeExitCommand($host->hostId, $opened->runtimeId, $generation, 'exit code 0'),
        );
    }

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(DeliverAgentCommand::text($this->agentIdOf($opened), $opened->sessionId, $key, $message));
    }
}
