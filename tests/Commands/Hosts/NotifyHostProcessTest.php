<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\SessionProcessStatus;
use App\Events\Connections\HostProcessStarted;
use App\Exceptions\HostProtocolRefused;
use App\Hosts\Commands\NotifyHostProcess\NotifyHostProcessCommand;
use App\Hosts\Commands\StopHostProcess\StopHostProcessCommand;
use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\Payloads\HostProcessReportPayload;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Values\HostInstructionSource;
use Tests\Support\Agents\TestAgent;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostProcess;
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

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_instructions',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'inboxes',
        'inbox_members',
        'links',
        'users',
    ];

    public function test_a_running_report_moves_the_row_and_raises_its_event(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('shell'))->observeEvents(HostProcessStarted::class);

        $this->journal->hostProcess('shell', fn (TestHostProcess $shell) => $shell
            ->report(HostProcessReportType::Running));

        $this->journal
            ->assertEvent(HostProcessStarted::class)
            ->assertResult(HostProcessStatus::Running, $this->journal->hostProcessCalled('shell')->status);
    }

    public function test_a_heal_starts_the_runtimes_next_generation_and_an_exit_ends_its_session(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal));
        $opened = $this->journal->openedRuntimeOf('Driven');
        $this->journal->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('agent', runtimeId: $opened->runtimeId));
        $generation = AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->process_generation;

        $this->journal
            ->hostProcess('agent', fn (TestHostProcess $agent) => $agent
                ->report(HostProcessReportType::Running)->report(HostProcessReportType::Restarted));
        $healed = AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->process_generation;
        $this->journal->hostProcess('agent', fn (TestHostProcess $agent) => $agent
            ->report(HostProcessReportType::Exited, 1));

        $this->journal->assertResult(
            [$generation + 1, false],
            [$healed, AgentSession::query()->whereKey($opened->sessionId)->sole()->isActive()],
        );
    }

    public function test_the_start_a_terminal_runs_for_runs_with_it_and_stops_when_it_exits(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal));
        $opened = $this->journal->openedRuntimeOf('Driven');
        $this->journal->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcessForStart('agent', $opened->sessionId));

        $this->journal->hostProcess('agent', fn (TestHostProcess $agent) => $agent
            ->report(HostProcessReportType::Running));
        $running = $this->journal->startOfSession($opened->sessionId);
        $this->journal->hostProcess('agent', fn (TestHostProcess $agent) => $agent
            ->report(HostProcessReportType::Exited, 0));

        $this->journal->assertResult(
            [[SessionProcessStatus::Running, 'pid:agent'], SessionProcessStatus::Stopped],
            [[$running->status, $running->execution_id], $running->refresh()->status],
        );
    }

    public function test_a_headless_turn_that_ends_leaves_its_start_running(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal));
        $opened = $this->journal->openedRuntimeOf('Driven');
        $this->journal->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcessForStart('turn', $opened->sessionId, HostProcessPurpose::AgentTurn));

        $this->journal
            ->hostProcess('turn', fn (TestHostProcess $turn) => $turn
                ->report(HostProcessReportType::Running)->report(HostProcessReportType::Exited, 0));

        $this->journal->assertResult(
            SessionProcessStatus::Running,
            $this->journal->startOfSession($opened->sessionId)->status,
        );
    }

    public function test_an_exited_process_refuses_its_open_instructions_but_its_stop(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('shell'));
        $process = $this->journal->hostProcessCalled('shell')->id;
        $this->journal->asSystem(new StopHostProcessCommand($process, 1000, 1000, HostInstructionSource::fromJournal()));

        $this->journal->hostProcess('shell', fn (TestHostProcess $shell) => $shell
            ->report(HostProcessReportType::Exited, 0));

        [$open, $stop] = $this->journal->hostInstructionsOf('shell');
        $this->journal->assertResult(
            [HostInstructionStatus::Refused, HostRefusal::NotRunning, HostInstructionStatus::Pending],
            [$open->status, $open->refusal, $stop->status],
        );
    }

    public function test_a_report_about_another_hosts_process_is_refused(): void
    {
        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->enrollHost('Other', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac
                ->openProcess('shell'));
        $report = new NotifyHostProcessCommand(
            $this->journal->hostCalled('Other')->hostId,
            $this->journal->hostProcessCalled('shell')->id,
            HostProcessReportPayload::from([
                'process_id' => $this->journal->hostProcessCalled('shell')->id,
                'report' => 'running',
                'identity' => 'pid:1',
                'generation' => 0,
            ]),
        );

        $this->journal->assertRefused(HostProtocolRefused::class, fn () => $this->journal->asSystem($report));
    }
}
