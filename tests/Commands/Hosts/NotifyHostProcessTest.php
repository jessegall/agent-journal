<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\NotifyHostProcess\NotifyHostProcessCommand;
use App\Commands\Hosts\StopHostProcess\StopHostProcessCommand;
use App\Data\Hosts\HostProcessReportData;
use App\Enums\Hosts\HostOrderStatus;
use App\Enums\Hosts\HostProcessReportType;
use App\Enums\Hosts\HostProcessStatus;
use App\Enums\Hosts\HostRefusal;
use App\Events\Connections\HostProcessStarted;
use App\Exceptions\HostProtocolRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Values\HostOrderSource;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A host's report moves its process: it runs, is healed into the runtime's next process generation, or ends and ends
 * its runtime's session; a report about another host's process is refused.
 */
#[TestsCommand(NotifyHostProcessCommand::class)]
final class NotifyHostProcessTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    public function test_a_running_report_moves_the_row_and_raises_its_event(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'shell')->observeEvents(HostProcessStarted::class);

        $this->journal->reportHostProcess('shell', HostProcessReportType::Running);

        $this->journal
            ->assertEvent(HostProcessStarted::class)
            ->assertResult(HostProcessStatus::Running, $this->journal->hostProcessCalled('shell')->status);
    }

    public function test_a_heal_starts_the_runtimes_next_generation_and_an_exit_ends_its_session(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
        $opened = $this->journal->openRuntimeOn('Driven', 'Mac', base_path());
        $this->journal->openHostProcess('Mac', 'agent', runtimeId: $opened->runtimeId);
        $generation = AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->process_generation;

        $this->journal
            ->reportHostProcess('agent', HostProcessReportType::Running)
            ->reportHostProcess('agent', HostProcessReportType::Restarted);
        $healed = AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->process_generation;
        $this->journal->reportHostProcess('agent', HostProcessReportType::Exited, 1);

        $this->journal->assertResult(
            [$generation + 1, false],
            [$healed, AgentSession::query()->whereKey($opened->sessionId)->sole()->isActive()],
        );
    }

    public function test_an_exited_process_refuses_its_open_orders_but_its_stop(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'shell');
        $process = $this->journal->hostProcessCalled('shell')->id;
        $this->journal->asSystem(new StopHostProcessCommand($process, 1000, 1000, HostOrderSource::fromJournal()));

        $this->journal->reportHostProcess('shell', HostProcessReportType::Exited, 0);

        [$open, $stop] = $this->journal->hostOrdersOf('shell');
        $this->journal->assertResult(
            [HostOrderStatus::Refused, HostRefusal::NotRunning, HostOrderStatus::Pending],
            [$open->status, $open->refusal, $stop->status],
        );
    }

    public function test_a_report_about_another_hosts_process_is_refused(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->enrollHost('Other', [base_path()])->openHostProcess('Mac', 'shell');
        $report = new NotifyHostProcessCommand(
            $this->journal->hostCalled('Other')->hostId,
            $this->journal->hostProcessCalled('shell')->id,
            HostProcessReportData::from(['report' => 'running', 'identity' => 'pid:1']),
        );

        $this->journal->assertRefused(HostProtocolRefused::class, fn () => $this->journal->asSystem($report));
    }
}
