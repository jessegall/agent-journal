<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Commands\RetryDriverRequest\RetryDriverRequestCommand;
use App\Agents\Drivers\Enums\HostWakeRefusal;
use App\Agents\Drivers\Enums\RequestOutcome;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Exceptions\DriverRequestRefused;
use App\Exceptions\HostReportRefused;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Sessions\OpenedRuntime;
use App\Values\DriverReceipt;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * Retrying a failed request starts a new attempt and refuses reports of the old one; a request the host reported
 * unavailable stays unavailable and a failure stays failed.
 */
#[TestsCommand(RetryDriverRequestCommand::class)]
final class RetryDriverRequestTest extends TestCase
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

    public function test_a_host_report_of_unavailable_leaves_the_request_unavailable_and_a_failure_stays_failed(): void
    {
        [$host, $opened] = $this->openRuntime();
        $unavailable = $this->deliver($opened, 'host-restarted', 'Hello');
        $failed = $this->deliver($opened, 'host-refused', 'Hello again');
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $this->notifyProgress($host->hostId, $unavailable->requestId, RequestProgress::Unavailable);
        $this->notifyProgress($host->hostId, $failed->requestId, RequestProgress::Failed);

        $request = DriverRequest::query()->findOrFail($unavailable->requestId);

        $this->assertSame(RequestProgress::Unavailable, $request->progress);
        $this->assertSame(RequestOutcome::EntryUnavailable, $request->outcome);
        $this->assertSame(RequestProgress::Failed, DriverRequest::query()->findOrFail($failed->requestId)->progress);

        $this->asOwner(new RetryDriverRequestCommand($request->id, $request->row_version, 'the runtime is back'));

        $this->assertSame(RequestProgress::Accepted, $request->fresh()?->progress);
    }

    public function test_retrying_a_failed_request_starts_a_new_attempt_and_refuses_reports_of_the_old_one(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'fails-once', 'Hello');
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $oldAttempt = $request->attempt_version;
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $request->id,
            $oldAttempt,
            RequestProgress::Failed,
            null,
            RequestOutcome::EntryUnavailable,
            refusal: HostWakeRefusal::ContainerUnavailable,
            hasCreatedNoProcess: true,
        ));
        $request->refresh();

        $this->asOwner(new RetryDriverRequestCommand($request->id, $request->row_version, 'the entry is back'));

        $request->refresh();
        $this->assertSame(
            [RequestProgress::Accepted, $oldAttempt + 1],
            [$request->progress, $request->attempt_version],
        );
        $this->expectException(HostReportRefused::class);
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $request->id,
            $oldAttempt,
            RequestProgress::Applied,
            'late',
            null,
        ));
    }

    public function test_a_proven_no_effect_failure_is_retried_once_from_two_tabs(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'two-tabs', 'Hello');
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $this->notifyProgress($host->hostId, $receipt->requestId, RequestProgress::Failed);
        $read = DriverRequest::query()->findOrFail($receipt->requestId);

        $first = $this->asOwner(new RetryDriverRequestCommand($read->id, $read->row_version, 'first tab'));
        $second = $this->asOwner(new RetryDriverRequestCommand($read->id, $read->row_version, 'second tab'));

        $this->assertSame($first, $second);
        $this->assertSame($read->attempt_version + 1, $read->fresh()?->attempt_version);
    }

    public function test_a_failure_without_proof_that_nothing_ran_is_not_retried(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'unproven', 'Hello');
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $request->id,
            $request->attempt_version,
            RequestProgress::Failed,
            null,
            RequestOutcome::Refused,
        ));
        $request->refresh();

        $this->assertThrows(
            fn () => $this->asOwner(new RetryDriverRequestCommand($request->id, $request->row_version, 'again')),
            DriverRequestRefused::class,
            DriverRequestRefused::noEffectUnproven($request->id)->getMessage(),
        );
    }

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(DeliverAgentCommand::text($this->agentIdOf($opened), $opened->sessionId, $key, $message));
    }

    private function notifyProgress(string $hostId, string $requestId, RequestProgress $progress): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);

        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $hostId,
            $request->id,
            $request->attempt_version,
            $progress,
            null,
            RequestOutcome::EntryUnavailable,
            refusal: HostWakeRefusal::ContainerUnavailable,
            hasCreatedNoProcess: true,
        ));
    }
}
