<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Bus\Exceptions\CommittedFactListenerFailed;
use App\Bus\IsolatedListener;
use App\Events\Connections\HostProcessExited;
use App\Hosts\Commands\NotifyHostProcess\NotifyHostProcessCommand;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Protocol\HostProcessReportType;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Exceptions;
use Tests\Fixtures\Hosts\FailingProcessEndListener;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports that one of its processes runs.
 */
#[TestsRoute('POST', 'agents.host.processes.report')]
final class HostProcessesReportPostTest extends GuardedRouteEntryTestCase
{
    /**
     * A report about a process the journal does not know, such as one whose rows were removed, is answered as gone, so
     * the host drops it instead of sending it again ahead of every later report.
     */
    public function test_a_report_about_a_process_the_journal_does_not_know_is_answered_as_gone(): void
    {
        $this->journal->owner()->enrollHost('Mac', [base_path()]);
        $target = route('agents.host.processes.report', ['process' => 'removed-process'], false);

        $answer = $this->journal->hostCall($this->journal->hostCalled('Mac'), 'POST', $target, [
            'process_id' => 'removed-process',
            'report' => 'exited',
            'generation' => 0,
            'exit_code' => 0,
        ]);

        $this->assertSame(
            [410, 'record_unavailable'],
            [$answer->getStatusCode(), json_decode((string) $answer->getContent(), true)['code'] ?? null],
        );
    }

    /**
     * A listener that fails on the end the report committed is the journal's failure, reported apart: the report stands
     * and is answered as heard, so the host sends its later reports instead of this one again.
     */
    public function test_a_listener_failing_on_the_committed_end_leaves_the_report_heard_and_is_reported(): void
    {
        Exceptions::fake();
        $this->journal->expectListenerFailure(FailingProcessEndListener::class);
        Event::listen(HostProcessExited::class, new IsolatedListener(
            HostProcessExited::class,
            FailingProcessEndListener::class.'@handle',
        ));
        $this->journal->owner()
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac
                ->openProcess('shell')
                ->process('shell', fn (TestHostProcess $shell) => $shell->report(HostProcessReportType::Running)));
        $process = $this->journal->hostProcessCalled('shell')->id;

        $answer = $this->journal->hostCall(
            $this->journal->hostCalled('Mac'),
            'POST',
            route('agents.host.processes.report', ['process' => $process], false),
            ['process_id' => $process, 'report' => 'exited', 'generation' => 0, 'exit_code' => 0],
        );

        Exceptions::assertReported(CommittedFactListenerFailed::class);
        $this->journal->assertResult(
            [204, HostProcessStatus::Exited],
            [$answer->getStatusCode(), $this->journal->hostProcessCalled('shell')->status],
        );
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters(['process' => 'process-1'])
            ->payload(['process_id' => 'process-1', 'report' => 'running', 'identity' => 'pid:1', 'generation' => 0])
            ->expects(NotifyHostProcessCommand::class, [
                'hostId' => $host->hostId,
                'processId' => 'process-1',
            ]);
    }
}
