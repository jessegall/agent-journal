<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Agents\NotifyRuntimeHeartbeat\NotifyRuntimeHeartbeatCommand;
use App\Commands\Agents\WakeAgent\WakeAgentCommand;
use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\Drivers\NotifyRuntimeActivity\NotifyRuntimeActivityCommand;
use App\Contracts\Actors\AgentTexts;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\HoldReason;
use App\Enums\Drivers\RequestOutcome;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Runs\RuntimeActivity;
use App\Events\Sessions\SessionStateChanged;
use App\Exceptions\HostReportRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Support\NativeTurnRecords;
use App\Support\OpenedRuntime;
use App\Support\PendingWorkSources;
use App\Values\AgentText;
use App\Values\BrowserInputCapabilities;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\CountedPendingWork;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A host reports a runtime's activity: it acknowledges only the claimed wake and nothing from before it was taken, an
 * idle wake with nothing pending starts no turn while one with work goes to the host, a heartbeat keeps the report
 * fresh, a report of an older generation is refused, and only a change of state tells the pages.
 */
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
        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-2'));
        $turns = $this->app->make(NativeTurnRecords::class);

        $turns->acknowledgeWake($opened->sessionId, CarbonImmutable::now()->addSecond());

        $wake = DriverRequest::query()->where('operation', DriverOperation::Wake)->sole();
        $this->assertSame(
            [1, 2, RequestProgress::Accepted],
            [$wake->wake_acknowledged, $wake->wake_requested, $wake->progress],
        );

        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $turns->acknowledgeWake($opened->sessionId, CarbonImmutable::now()->addSecond());

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
        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->app->make(NativeTurnRecords::class)->acknowledgeWake(
            $opened->sessionId,
            CarbonImmutable::now()->subMinute(),
        );

        $wake = DriverRequest::query()->where('operation', DriverOperation::Wake)->sole();
        $this->assertSame([0, RequestProgress::Staged], [$wake->wake_acknowledged, $wake->progress]);
    }

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

        $claimed = $this->journal->asSystem(
            new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()),
        );

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

        $claimed = $this->journal->asSystem(
            new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()),
        );

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
    public function test_a_heartbeat_keeps_an_idle_runtimes_report_fresh(): void
    {
        [$host, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->journal->asSystem(new NotifyRuntimeActivityCommand(
            $host->hostId,
            $opened->runtimeId,
            RuntimeActivity::Idle,
            HoldReason::None,
            $runtime->process_generation,
        ));

        $this->travel(AgentRuntime::FRESH_SECONDS + 1)->seconds();
        $this->assertTrue($runtime->refresh()->isStale(CarbonImmutable::now()));

        $this->journal->asSystem(new NotifyRuntimeHeartbeatCommand(
            $host->hostId,
            $opened->runtimeId,
            $runtime->process_generation,
            'owned process alive',
        ));

        $this->assertFalse($runtime->refresh()->isStale(CarbonImmutable::now()));
        $this->assertSame(RuntimeActivity::Idle, $runtime->activity);
    }

    /**
     * A page learns that a session's state changed from the host's report itself, so its header
     * never waits for a reload; a beat that only keeps a fresh report fresh says nothing.
     */
    public function test_a_report_that_changes_a_sessions_state_tells_the_pages_and_a_plain_beat_does_not(): void
    {
        [$host, $opened] = $this->openRuntime();
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;
        $idle = new NotifyRuntimeActivityCommand(
            $host->hostId,
            $opened->runtimeId,
            RuntimeActivity::Idle,
            HoldReason::None,
            $generation,
        );
        $beat = new NotifyRuntimeHeartbeatCommand(
            $host->hostId,
            $opened->runtimeId,
            $generation,
            'owned process alive',
        );
        $told = fn (SessionStateChanged $change) => $change->sessionId === $opened->sessionId;
        Event::fake([SessionStateChanged::class]);

        $this->journal->asSystem($idle);
        Event::assertDispatchedTimes(SessionStateChanged::class, 1);
        Event::assertDispatched(SessionStateChanged::class, $told);

        $this->journal->asSystem($beat);
        Event::assertDispatchedTimes(SessionStateChanged::class, 1);

        $this->travel(AgentRuntime::FRESH_SECONDS + 1)->seconds();
        $this->journal->asSystem($beat);
        Event::assertDispatchedTimes(SessionStateChanged::class, 2);
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
}
