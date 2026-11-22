<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\ReportRequestProgress\ReportRequestProgressCommand;
use App\Enums\ConversationModeType;
use App\Enums\DriverVariant;
use App\Enums\HostRefusal;
use App\Enums\RequestProgress;
use App\Enums\StartOriginType;
use App\Enums\StartReadiness;
use App\Models\AgentSession;
use App\Models\DriverRequest;
use App\Models\StartRecord;
use App\Support\ActorIdentity;
use App\Support\AgentWakes;
use App\Support\EnrolledHost;
use App\Support\InitialWakeSettlement;
use App\Support\OpenedRuntime;
use App\Values\BrowserInputCapabilities;
use App\Values\ClaimedRequest;
use App\Values\StackTarget;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\TestCase;

/**
 * Doc 103, First launch and exact resume: a message sent while a start's program is proving its conversation waits,
 * and goes out once only after the bootstrap proves it; another conversation refuses the start with the message
 * still held, and a report after the refusal changes nothing.
 */
final class StartIdentityTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use RunsTrustedCommands;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'start_records',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'runtime_events',
        'accounts',
        'active_accounts',
        'process_starts',
        'links',
    ];

    private const string CONVERSATION = 'conversation-1';

    public function test_a_message_sent_during_startup_goes_out_once_after_the_bootstrap_proves_its_conversation(): void
    {
        [$host, $opened, $wake, $record] = $this->startWithMessage();

        $this->assertSame([$wake->id], $this->claimedIds($host));
        $this->assertSame(StartReadiness::PreparingIdentity, $record->refresh()->readiness);

        $this->reportApplied($host, $wake, self::CONVERSATION);

        $this->assertSame([$opened->firstRequestId], $this->claimedIds($host));
        $this->assertSame([], $this->claimedIds($host));
        $this->assertSame([StartReadiness::Ready, self::CONVERSATION], [$record->refresh()->readiness, $record->native_id]);
    }

    public function test_another_conversation_refuses_the_start_and_the_message_stays_held(): void
    {
        [$host, $opened, $wake, $record] = $this->startWithMessage();
        $record->bindIdentity(self::CONVERSATION);
        $record->markIdentityUncertain();
        $this->claimedIds($host);

        $this->reportApplied($host, $wake, 'conversation-2');

        $this->assertSame(
            [StartReadiness::Refused, HostRefusal::IdentityMismatch->value],
            [$record->refresh()->readiness, $record->refusal_reason],
        );
        $this->assertSame([], $this->claimedIds($host));
        $this->assertSame(
            RequestProgress::Accepted,
            DriverRequest::query()->findOrFail($opened->firstRequestId)->progress,
        );
    }

    public function test_a_bootstrap_report_after_the_start_was_refused_changes_nothing(): void
    {
        [$host, , $wake, $record] = $this->startWithMessage();
        $this->claimedIds($host);
        $record->refuseFor(HostRefusal::IdentityMismatch);

        $this->reportApplied($host, $wake, self::CONVERSATION);

        $this->assertSame([StartReadiness::Refused, null], [$record->refresh()->readiness, $record->native_id]);
        $this->assertSame([], $this->claimedIds($host));
    }

    /**
     * @return array{EnrolledHost, OpenedRuntime, DriverRequest, StartRecord}
     */
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
            variant: DriverVariant::Headless,
        );
        $record = StartRecord::accept($request, TestSelections::pinOf($request), ActorIdentity::system(), None::create());
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
        $claimed = $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        return array_map(fn (ClaimedRequest $request) => $request->requestId, $claimed->requests);
    }

    private function reportApplied(EnrolledHost $host, DriverRequest $wake, string $conversation): void
    {
        $wake->refresh();
        $this->asSystem(new ReportRequestProgressCommand(
            $host->hostId,
            $wake->id,
            $wake->attempt_version,
            RequestProgress::Applying,
            null,
            null,
        ));
        $this->asSystem(new ReportRequestProgressCommand(
            $host->hostId,
            $wake->id,
            $wake->attempt_version,
            RequestProgress::Applied,
            $conversation,
            null,
        ));
    }
}
