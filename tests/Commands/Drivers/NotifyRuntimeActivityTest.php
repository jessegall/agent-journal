<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Actors\Contracts\AgentTexts;
use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Commands\WakeAgent\WakeAgentCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Commands\NotifyRuntimeActivity\NotifyRuntimeActivityCommand;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Drivers\Enums\RequestOutcome;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Drivers\Values\RequestReportBinding;
use App\Exceptions\HostReportRefused;
use App\Hooks\Exceptions\StaleProcessGeneration;
use App\Hooks\NativeTurnRecords;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Processes\Enums\RuntimeActivity;
use App\Sessions\OpenedRuntime;
use App\Stacks\PendingWorkSources;
use App\Values\AgentText;
use App\Values\DriverReceipt;
use Tests\Fixtures\Agents\CountedPendingWork;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A host reports a runtime's activity: an idle wake with nothing pending starts no turn while one with work goes to the
 * host, a heartbeat keeps the report fresh, a report of an older generation is refused, and only a change of state tells
 * the pages.
 */
#[TestsCommand(NotifyRuntimeActivityCommand::class)]
final class NotifyRuntimeActivityTest extends TestCase
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

    public function test_a_wake_of_an_idle_session_with_nothing_pending_settles_as_no_work_and_starts_no_turn(): void
    {
        $this->app->make(PendingWorkSources::class)->register(CountedPendingWork::class);
        CountedPendingWork::$count = 0;
        [$host, $opened] = $this->openRuntime();
        $this->journal->asSystem(
            new NotifyRuntimeActivityCommand(
                $host->hostId,
                $opened->runtimeId,
                RuntimeActivity::Idle,
                HoldReason::None,
                1,
            ),
        );
        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));

        $claimed = $this->journal->claimRequestsOnHost($host->hostId, 10);

        $wake = DriverRequest::query()->where('operation', DriverOperation::Wake)->sole();
        $this->assertSame([], $claimed->requests);
        $this->assertSame([RequestProgress::Applied, RequestOutcome::NoWork], [$wake->progress, $wake->outcome]);
    }

    public function test_a_wake_of_an_idle_session_with_pending_work_goes_to_the_host(): void
    {
        $this->app->make(PendingWorkSources::class)->register(CountedPendingWork::class);
        CountedPendingWork::$count = 1;
        [$host, $opened] = $this->openRuntime();
        $this->journal->asSystem(
            new NotifyRuntimeActivityCommand(
                $host->hostId,
                $opened->runtimeId,
                RuntimeActivity::Idle,
                HoldReason::None,
                1,
            ),
        );
        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));

        $claimed = $this->journal->claimRequestsOnHost($host->hostId, 10);

        $this->assertCount(1, $claimed->requests);
        $this->assertSame(
            RequestProgress::Staged,
            DriverRequest::query()->where('operation', DriverOperation::Wake)->sole()->progress,
        );
        // The journal sends the wake's whole prompt; the host makes none up.
        $prompt = $this->app->make(AgentTexts::class)->render(AgentText::of('core.drivers.pending_work'));
        $this->assertSame($prompt, $claimed->requests[0]->message);
    }

    public function test_a_new_process_with_nothing_unshown_asks_for_no_wake(): void
    {
        [$host, $opened] = $this->openRuntime();
        $asked = $this->wakesAskedOf($opened);

        $this->journal->asSystem(
            new NotifyRuntimeActivityCommand(
                $host->hostId,
                $opened->runtimeId,
                RuntimeActivity::Idle,
                HoldReason::None,
                2,
            ),
        );

        $this->assertSame($asked, $this->wakesAskedOf($opened));
    }

    public function test_a_report_of_an_older_generation_is_refused_and_leaves_newer_facts(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->journal->asSystem(
            new NotifyRuntimeActivityCommand(
                $host->hostId,
                $opened->runtimeId,
                RuntimeActivity::Running,
                HoldReason::None,
                2,
            ),
        );

        try {
            $this->journal->asSystem(new NotifyRuntimeActivityCommand(
                $host->hostId,
                $opened->runtimeId,
                RuntimeActivity::Idle,
                HoldReason::None,
                1,
            ));
            $this->fail('A stale report was applied.');
        } catch (HostReportRefused) {
            $this->assertSame(
                RuntimeActivity::Running,
                AgentRuntime::query()->findOrFail($opened->runtimeId)->activity,
            );
        }
    }

    /**
     * An idle runtime reports nothing between two turns, so its last report grew stale after a
     * minute and its session read as Status unknown though nothing was wrong.
     */
    public function test_the_host_reports_a_navigation_hold_and_ends_requests_unavailable_or_unconfirmed(): void
    {
        [$host, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $unavailable = $this->deliver($opened, 'entry-gone', 'Pick GPT-6');
        $unconfirmed = $this->deliver($opened, 'only-highlighted', 'Pick GPT-6 again');
        $this->journal->claimRequestsOnHost($host->hostId, 10);

        $this->journal->asSystem(new NotifyRuntimeActivityCommand(
            $host->hostId,
            $runtime->id,
            RuntimeActivity::Running,
            HoldReason::NavigationNeeded,
            $runtime->process_generation,
        ));
        $ends = [
            [$unavailable, RequestProgress::Unavailable, RequestOutcome::EntryUnavailable],
            [$unconfirmed, RequestProgress::Failed, RequestOutcome::Unconfirmed],
        ];
        $attempts = DriverRequest::query()
            ->whereKey([$unavailable->requestId, $unconfirmed->requestId])
            ->limit(2)
            ->pluck('attempt_version', 'id');

        foreach ($ends as [$receipt, $progress, $outcome]) {
            $this->journal->asSystem(new NotifyRequestProgressCommand(
                $host->hostId,
                $receipt->requestId,
                $attempts[$receipt->requestId],
                $progress,
                null,
                $outcome,
            ));
        }

        $this->assertSame(HoldReason::NavigationNeeded, $runtime->fresh()?->hold_reason);
        $gone = DriverRequest::query()->findOrFail($unavailable->requestId);
        $this->assertSame(
            [RequestProgress::Unavailable, RequestOutcome::EntryUnavailable],
            [$gone->progress, $gone->outcome],
        );
        $highlighted = DriverRequest::query()->findOrFail($unconfirmed->requestId);
        $this->assertSame(
            [RequestProgress::Failed, RequestOutcome::Unconfirmed],
            [$highlighted->progress, $highlighted->outcome],
        );
    }

    public function test_a_hook_call_of_an_older_generation_is_refused(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->journal->asSystem(
            new NotifyRuntimeActivityCommand(
                $host->hostId,
                $opened->runtimeId,
                RuntimeActivity::Running,
                HoldReason::None,
                3,
            ),
        );

        $this->expectException(StaleProcessGeneration::class);

        $this->app->make(NativeTurnRecords::class)->checkGeneration($opened->sessionId, 2);
    }

    public function test_an_idle_report_after_a_missing_one_leaves_the_running_request_uncertain(): void
    {
        [$host, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $receipt = $this->deliver($opened, 'gap', 'Read the notes');
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $this->numberedReport($host->hostId, $receipt->requestId, RequestProgress::Applying, 1);

        $this->journal->asSystem(new NotifyRuntimeActivityCommand(
            $host->hostId,
            $runtime->id,
            RuntimeActivity::Idle,
            HoldReason::None,
            $runtime->process_generation,
            3,
        ));

        $this->assertSame(
            RequestProgress::DeliveryUncertain,
            DriverRequest::query()->findOrFail($receipt->requestId)->progress,
        );
    }

    /**
     * How many times the runtime's wakes were asked for, over all its wake requests.
     */
    private function wakesAskedOf(OpenedRuntime $opened): int
    {
        return (int) DriverRequest::query()
            ->where('agent_runtime_id', $opened->runtimeId)
            ->where('operation', DriverOperation::Wake)
            ->sum('wake_requested');
    }

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(DeliverAgentCommand::text($this->agentIdOf($opened), $opened->sessionId, $key, $message));
    }

    private function numberedReport(string $hostId, string $requestId, RequestProgress $progress, int $sequence): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);
        $runtime = AgentRuntime::query()->findOrFail($request->agent_runtime_id);

        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $hostId,
            $request->id,
            $request->attempt_version,
            $progress,
            null,
            null,
            binding: new RequestReportBinding($runtime->agent_session_id, null, $runtime->process_generation),
            sequence: $sequence,
        ));
    }
}
