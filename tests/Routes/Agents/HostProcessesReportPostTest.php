<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Hosts\Commands\NotifyHostProcess\NotifyHostProcessCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
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
