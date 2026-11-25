<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\CheckStartStatus\CheckStartStatusCommand;
use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\Drivers\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\DriverType;
use App\Enums\Drivers\HostWakeRefusal;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Sessions\StartOriginType;
use App\Enums\Sessions\StartReadiness;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Sessions\SessionRequest;
use App\Support\ActorIdentity;
use App\Support\AgentWakes;
use App\Support\EnrolledHost;
use App\Support\InitialWakeSettlement;
use App\Support\ReadinessCheckSweep;
use App\Values\BrowserInputCapabilities;
use App\Values\ClaimedRequest;
use App\Values\StackTarget;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Carbon\CarbonImmutable;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\TestCase;

/**
 * Checking a start's status: a lost ready report is settled with the host's kept one, a ready start's host is asked and
 * a refusal keeps its proof, a host with no ready report leaves the start uncertain with its message held, and so does
 * a check no host answers within its minute.
 */
final class CheckStartStatusTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use RunsTrustedCommands;

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

    public function test_check_status_settles_a_lost_ready_report_with_the_hosts_kept_one(): void
    {
        [$host, $opened, $wake, $record] = $this->startWithMessage();
        $this->claimedIds($host);

        $this->assertTrue($this->checkStatus($record));
        $this->assertTrue($this->checkStatus($record));
        $check = $this->claimed($host);
        $this->notifyApplied($host, $wake, self::CONVERSATION);
        $this->answerCheck($host, $check[0]->requestId, RequestProgress::Applied);

        $this->assertSame([DriverOperation::ResendReadiness->value], array_map(fn (ClaimedRequest $request) => $request->operation, $check));
        $this->assertSame(StartReadiness::Ready, $record->refresh()->readiness);
        $this->assertSame([$opened->firstRequestId], $this->claimedIds($host));
        $this->assertSame([], $this->claimedIds($host));
    }

    public function test_check_status_asks_the_host_of_a_ready_start_and_a_refusal_keeps_its_proof(): void
    {
        [$host, , $wake, $record] = $this->startWithMessage();
        $this->claimedIds($host);
        $this->notifyApplied($host, $wake, self::CONVERSATION);
        $readiness = $record->refresh()->readiness;

        $this->assertTrue($this->checkStatus($record));
        $check = $this->claimed($host)[0];
        $this->assertSame(DriverOperation::ResendReadiness->value, $check->operation);

        $this->answerCheck($host, $check->requestId, RequestProgress::Failed, HostWakeRefusal::NoObservation);

        $this->assertSame($readiness, $record->refresh()->readiness);
    }

    public function test_a_host_with_no_ready_report_leaves_the_start_uncertain_and_its_message_held(): void
    {
        [$host, $opened, , $record] = $this->startWithMessage();
        $this->claimedIds($host);
        $this->checkStatus($record);
        $check = $this->claimed($host)[0];

        $this->answerCheck($host, $check->requestId, RequestProgress::Failed, HostWakeRefusal::NoObservation);

        $this->assertSame(StartReadiness::Uncertain, $record->refresh()->readiness);
        $this->assertSame([], $this->claimedIds($host));
        $this->assertTrue($this->checkStatus($record));
        $this->assertNotContains($opened->firstRequestId, $this->claimedIds($host));
    }

    public function test_a_check_no_host_answers_within_its_minute_leaves_the_start_uncertain(): void
    {
        [$host, , , $record] = $this->startWithMessage();
        $this->claimedIds($host);
        $this->checkStatus($record);
        $check = $this->claimed($host)[0];

        $this->travel(ReadinessCheckSweep::ANSWER_SECONDS_LIMIT + 1)->seconds();
        $this->app->make(ReadinessCheckSweep::class)->sweep(CarbonImmutable::now());

        $this->assertSame(RequestProgress::Unavailable, DriverRequest::query()->findOrFail($check->requestId)->progress);
        $this->assertSame(StartReadiness::Uncertain, $record->refresh()->readiness);
    }

    private function checkStatus(SessionRequest $record): bool
    {
        $session = AgentSession::query()->findOrFail($record->session_id);

        return $this->asOwner(new CheckStartStatusCommand($session->agent_id, $session->id, (string) str()->ulid()));
    }

    private function answerCheck(
        EnrolledHost $host,
        string $requestId,
        RequestProgress $progress,
        HostWakeRefusal|null $refusal = null,
    ): void {
        $this->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $requestId,
            DriverRequest::query()->findOrFail($requestId)->attempt_version,
            $progress,
            null,
            null,
            refusal: $refusal,
        ));
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
        $record = SessionRequest::create($request, TestSelections::pinOf($request), ActorIdentity::system(), None::create());
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
        return $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()))->requests;
    }

    private function notifyApplied(EnrolledHost $host, DriverRequest $wake, string $conversation): void
    {
        $wake->refresh();
        $this->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $wake->id,
            $wake->attempt_version,
            RequestProgress::Applying,
            null,
            null,
        ));
        $this->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $wake->id,
            $wake->attempt_version,
            RequestProgress::Applied,
            $conversation,
            null,
        ));
    }
}
