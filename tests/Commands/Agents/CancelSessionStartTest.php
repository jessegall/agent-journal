<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\CancelSessionStart\CancelSessionStartCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Enums\ConversationModeType;
use App\Hosts\EnrolledHost;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Sessions\SessionRequest;
use App\Sessions\AgentWakes;
use App\Sessions\Enums\StartOriginType;
use App\Sessions\Enums\StartReadiness;
use App\Sessions\InitialWakeSettlement;
use App\Sessions\OpenedRuntime;
use App\Sessions\Values\StartPolicy;
use App\Support\ActorReference;
use App\Values\ClaimedRequest;
use App\Values\StackTarget;
use App\Values\StartRequest;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A ready report after the start was cancelled changes nothing.
 */
#[TestsCommand(CancelSessionStartCommand::class)]
final class CancelSessionStartTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'session_requests',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'runtime_events',
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
    ];

    private const string CONVERSATION = 'conversation-1';

    /**
     * @return array{EnrolledHost, OpenedRuntime, DriverRequest, SessionRequest}
     */
    public function test_a_ready_report_after_the_start_was_cancelled_changes_nothing(): void
    {
        [$host, $opened, $wake, $record] = $this->startWithMessage();
        $this->claimedIds($host);
        $this->asOwner(new CancelSessionStartCommand(
            AgentSession::query()->findOrFail($opened->sessionId)->agent_id,
            $opened->sessionId,
            'cancel-1',
        ));

        $this->notifyApplied($host, $wake, self::CONVERSATION);

        $this->assertSame([StartReadiness::Cancelled, null], [$record->refresh()->readiness, $record->native_id]);
        $this->assertNotContains($opened->firstRequestId, $this->claimedIds($host));
    }

    private function startWithMessage(): array
    {
        [$host, $opened] = $this->openRuntime(firstMessage: 'Start with the plan.');
        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $request = new StartRequest(
            TestSelections::requestId(),
            $session->agent_id,
            TestSelections::of(),
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );
        $record = SessionRequest::create(
            $request,
            TestSelections::pinOf($request),
            ActorReference::system(),
            None::create(),
        );
        $record->startedAs($session);
        $receipt = $this->app->make(AgentWakes::class)->wake(
            new StackTarget($session->agent_id, $session->id),
            InitialWakeSettlement::keyOf($session->id),
        );

        return [$host, $opened, DriverRequest::query()->findOrFail($receipt->requestId), $record];
    }

    /**
     * @return list<string>
     */
    private function claimedIds(EnrolledHost $host): array
    {
        return array_map(fn (ClaimedRequest $request) => $request->requestId, $this->claimed($host));
    }

    /**
     * @return list<ClaimedRequest>
     */
    private function claimed(EnrolledHost $host): array
    {
        return $this->journal->claimRequestsOnHost($host->hostId, 10)->requests;
    }

    private function notifyApplied(EnrolledHost $host, DriverRequest $wake, string $conversation): void
    {
        $wake->refresh();
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $wake->id,
            $wake->attempt_version,
            RequestProgress::Applying,
            null,
            null,
        ));
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $wake->id,
            $wake->attempt_version,
            RequestProgress::Applied,
            $conversation,
            null,
        ));
    }
}
