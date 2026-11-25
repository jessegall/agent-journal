<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\DeliverAgent\DeliverAgentCommand;
use App\Commands\Agents\NotifyRuntimeExit\NotifyRuntimeExitCommand;
use App\Commands\Agents\StopAgent\StopAgentCommand;
use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Sessions\AgentDirectory;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Runs\RuntimeActivity;
use App\Enums\Sessions\SessionStatus;
use App\Exceptions\DriverRequestRefused;
use App\Exceptions\StopOutdated;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Support\ActorReference;
use App\Support\AgentStatus;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Values\BrowserInputCapabilities;
use App\Values\DriverReceipt;
use App\Values\OwnerAuthority;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * Stopping an agent: a stopping runtime refuses new requests, two stops of one generation converge on one request, a
 * stop waiting for its helpers says so, and ending the main stops its helpers first.
 */
#[TestsCommand(StopAgentCommand::class)]
final class StopAgentTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;

    private const string STOPPING_LABEL = 'Stopping · Waiting for helpers';

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

    public function test_a_stopping_runtime_refuses_new_requests(): void
    {
        [, $opened] = $this->openRuntime();
        $this->asOwner(new StopAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'stop-1'));

        $this->expectException(DriverRequestRefused::class);

        $this->deliver($opened, 'after-stop', 'Too late');
    }

    public function test_two_stops_of_the_same_generation_converge_on_one_request(): void
    {
        [, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $first = $this->asOwner(new StopAgentCommand($agentId, $opened->sessionId, 'stop-a', $generation));
        $second = $this->asOwner(new StopAgentCommand($agentId, $opened->sessionId, 'stop-b', $generation));

        $this->assertSame($first->requestId, $second->requestId);
        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::Stop)->count());
        $this->assertThrows(
            fn () => $this->asOwner(new StopAgentCommand($agentId, $opened->sessionId, 'stop-c', $generation + 1)),
            StopOutdated::class,
        );
    }

    public function test_a_stop_waiting_for_its_helpers_says_so(): void
    {
        [, $main] = $this->openRuntime();
        [, $helper] = $this->openRuntime();
        AgentSession::query()->whereKey($helper->sessionId)->update(['parent_session_id' => $main->sessionId]);
        $agentId = $this->agentIdOf($main);

        $this->asOwner(new StopAgentCommand($agentId, $main->sessionId, 'stop-main'));

        $this->assertSame(self::STOPPING_LABEL, $this->statusOf($agentId)->label);
    }

    public function test_ending_the_main_stops_its_helpers_first_and_hands_its_own_stop_over_once_they_are_proven(): void
    {
        [$mainHost, $main] = $this->openRuntime();
        [$helperHost, $helper] = $this->openRuntime();
        AgentSession::query()->whereKey($helper->sessionId)->update(['parent_session_id' => $main->sessionId]);
        $stopOf = fn (OpenedRuntime $opened) => DriverRequest::query()->where('agent_runtime_id', $opened->runtimeId)
            ->where('operation', DriverOperation::Stop)->sole();

        $this->asOwner(new StopAgentCommand($this->agentIdOf($main), $main->sessionId, 'stop-main'));

        $this->assertSame(RuntimeActivity::Stopping, AgentRuntime::query()->findOrFail($helper->runtimeId)->activity);
        $this->assertSame(
            [],
            $this->journal->asSystem(
                new ClaimDriverRequestsCommand($mainHost->hostId, 10, BrowserInputCapabilities::none()),
            )->requests,
        );
        $this->assertSame(RequestProgress::Accepted, $stopOf($main)->progress);

        $helperClaim = $this->journal->asSystem(
            new ClaimDriverRequestsCommand($helperHost->hostId, 10, BrowserInputCapabilities::none()),
        );
        $this->assertSame(
            [DriverOperation::Stop->value],
            array_map(fn ($request) => $request->operation, $helperClaim->requests),
        );
        $this->notifyExit($helperHost, $helper);

        $mainClaim = $this->journal->asSystem(
            new ClaimDriverRequestsCommand($mainHost->hostId, 10, BrowserInputCapabilities::none()),
        );
        $this->assertSame(
            [DriverOperation::Stop->value],
            array_map(fn ($request) => $request->operation, $mainClaim->requests),
        );
        $this->assertSame(SessionStatus::Active, AgentSession::query()->findOrFail($main->sessionId)->status);
        $this->assertSame(RequestProgress::Applied, $stopOf($helper)->progress);
    }

    private function statusOf(string $agentId): AgentStatus
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorReference::forUser('owner'), new OwnerAuthority('test'));

        return $this->app->make(AgentDirectory::class)->visibleAgent($agentId)->status;
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
