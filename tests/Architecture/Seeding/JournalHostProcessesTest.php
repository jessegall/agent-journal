<?php

declare(strict_types=1);

namespace Tests\Architecture\Seeding;

use App\Enums\Agents\SessionProcessStatus;
use App\Enums\Drivers\DriverType;
use App\Enums\Hosts\HostOrderStatus;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessReportType;
use App\Enums\Hosts\HostProcessStatus;
use App\Enums\Hosts\HostProcessType;
use App\Support\Drivers\DriverSupervisor;
use App\Support\Hosts\ProcessFeed;
use Tests\Support\Drivers\StandInProcessDriver;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The test journal opens a host's processes through their real open order and moves them by their host's reports.
 */
final class JournalHostProcessesTest extends TestCase
{
    use RefreshHookDatabase;
    use WithActiveAccount;

    public function test_a_process_is_opened_by_its_order_and_moved_by_its_hosts_report(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'pipe', HostProcessType::Pipe);
        [$open] = $this->journal->hostOrdersOf('pipe');

        $this->journal->reportHostProcess('pipe', HostProcessReportType::Running);

        $this->journal->assertResult(
            [HostOrderType::OpenProcess, HostProcessType::Pipe, HostProcessStatus::Running, 'pid:pipe'],
            [
                $open->type,
                $this->journal->hostProcessCalled('pipe')->type,
                $this->journal->hostProcessCalled('pipe')->status,
                $this->journal->hostProcessCalled('pipe')->execution_identity,
            ],
        );
    }

    public function test_a_driven_process_prints_has_its_order_answered_and_its_worker_started(): void
    {
        $this->journal
            ->fakeStartedPrograms()
            ->driveProcessesWith(HostProcessPurpose::Probe, StandInProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->openHostProcess('Mac', 'shell')
            ->printOnHostProcess('shell', 'ready');
        [$open] = $this->journal->hostOrdersOf('shell');
        $process = $this->journal->hostProcessCalled('shell')->id;

        $this->journal->answerHostOrder($open);
        $this->journal->service(DriverSupervisor::class)->startNeeded();

        $this->journal
            ->assertProgramStarted(['php', 'artisan', 'drivers:work', $process])
            ->assertResult(
                [HostOrderStatus::Done, 'ready'],
                [$open->refresh()->status, $this->journal->service(ProcessFeed::class)->latestFrame($process)?->rows[0]],
            );
    }

    public function test_a_driver_worker_begins_on_a_process_and_steps_on_what_it_prints(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, StandInProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->openHostProcess('Mac', 'shell');

        $work = $this->journal->beginDriverWorker('shell');
        $this->journal->printOnHostProcess('shell', '> ');

        $this->journal->assertResult([1, true], [$work->generation, $this->journal->stepDriverWorker($work, 200)]);
    }

    public function test_a_process_opened_for_a_start_is_linked_to_the_start_the_host_claimed(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
        $opened = $this->journal->openRuntimeOn('Driven', 'Mac', base_path(), driverType: DriverType::Terminal);

        $this->journal->openHostProcessForStart('Mac', 'agent', $opened->sessionId, HostProcessPurpose::AgentTurn);

        $process = $this->journal->hostProcessCalled('agent');
        $start = $this->journal->startOfSession($opened->sessionId);
        $this->journal->assertResult(
            [$start->id, $this->journal->hostCalled('Mac')->hostId, HostProcessPurpose::AgentTurn],
            [$process->session_process_id, $start->host_id, $process->purpose],
        );
    }

    public function test_a_process_the_journal_opened_is_named_for_the_test(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
        $opened = $this->journal->openRuntimeOn('Driven', 'Mac', base_path());

        $this->journal->callJournalProcess('probe', $opened->runtimeId, HostProcessPurpose::BuildProbe);

        $process = $this->journal->hostProcessCalled('probe');
        $this->journal->assertResult(
            [$opened->runtimeId, HostProcessPurpose::BuildProbe],
            [$process->agent_runtime_id, $process->purpose],
        );
    }

    public function test_a_passed_build_probe_orders_the_sign_in_probe(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
        $opened = $this->journal->openRuntimeOn('Driven', 'Mac', base_path());

        $this->journal->passBuildProbe('driven', $opened->runtimeId);

        $this->journal->assertResult(
            [HostProcessPurpose::BuildProbe, HostProcessPurpose::SignInProbe],
            [
                $this->journal->hostProcessCalled('driven-probe')->purpose,
                $this->journal->hostProcessCalled('driven-sign-in')->purpose,
            ],
        );
    }

    public function test_shown_driver_arrangements_let_the_journal_take_a_headless_start(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);

        $opened = $this->journal->openRuntimeOn('Driven', 'Mac', base_path());

        $this->journal->assertResult(
            SessionProcessStatus::Starting,
            $this->journal->startOfSession($opened->sessionId)->status,
        );
    }

    public function test_an_orders_payload_reads_back_as_the_host_receives_it(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'pipe', HostProcessType::Pipe);

        $payload = $this->journal->payloadOf($this->journal->hostOrdersOf('pipe')[0]);

        $this->journal->assertResult(['pipe', ['sh', '-c', 'cat']], [$payload['type'], $payload['argv']]);
    }

    public function test_what_a_pipe_prints_follows_what_it_printed_before(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'pipe', HostProcessType::Pipe);

        $this->journal->printOnPipe('pipe', "one\n")->printOnPipe('pipe', "two\n");

        $process = $this->journal->hostProcessCalled('pipe');
        $chunks = array_map(
            fn ($entry) => [$entry->chunk?->offset, $entry->chunk?->printed()],
            $this->journal->service(ProcessFeed::class)->after($process->id, ProcessFeed::FIRST_CURSOR, 0),
        );
        $this->journal->assertResult([[[0, "one\n"], [4, "two\n"]], 8], [$chunks, $process->output_offset]);
    }
}
