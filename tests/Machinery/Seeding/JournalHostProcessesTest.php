<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Agents\Drivers\Codex\CodexSignInReader;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Enums\MarkTone;
use App\Agents\Drivers\Enums\SignInCodeDirection;
use App\Agents\Drivers\Work\DriverSupervisor;
use App\Agents\Enums\SessionProcessStatus;
use App\Agents\Values\ProviderKey;
use App\Connections\PublishedReleases;
use App\Hosts\Commands\PullHostPrivateValue\PullHostPrivateValueCommand;
use App\Hosts\Commands\RequestHostProtection\RequestHostProtectionCommand;
use App\Hosts\Commands\WriteHostPrivateValue\WriteHostPrivateValueCommand;
use App\Hosts\Enums\HostOrderStatus;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessReportType;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Enums\HostProcessType;
use App\Hosts\Enums\HostRefusal;
use App\Hosts\ProcessFeed;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\Host;
use App\Projects\Enums\ArrangementType;
use App\Values\DriverFamily;
use App\Values\HostOrderSource;
use Tests\Support\Drivers\AcceptingSignInReader;
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

    public function test_a_driver_family_a_module_adds_is_started_as_the_family_it_runs_like(): void
    {
        $family = new DriverFamily(
            'example',
            'Example',
            ProviderKey::from('example'),
            'echo',
            false,
            [],
            [],
            'images/drivers/example.svg',
            MarkTone::CurrentColor,
            SignInCodeDirection::Outgoing,
        );

        $this->journal->setUpDriverFamily($family, DefaultDrivers::CLAUDE_CODE);

        $added = $this->journal->driverProfile('example');
        $claude = $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE);

        $this->journal->assertResult(
            ['example', $claude->hookAdapter()::class, $claude->signInMethods()],
            [$added->family(), $added->hookAdapter()::class, $added->signInMethods()],
        );
    }

    public function test_the_owner_chooses_an_account_for_a_driver_family(): void
    {
        $this->journal->owner()->chooseActiveAccount(DefaultDrivers::CODEX, 'Spare account');

        $this->journal->assertResult(
            'Spare account',
            $this->journal->chosenAccounts()[DefaultDrivers::CODEX]->label,
        );
    }

    public function test_a_contained_host_is_enrolled_contained(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);

        $host = Host::query()->whereKey($this->journal->hostCalled('Box')->hostId)->sole();
        $this->journal->assertResult(ArrangementType::Contained, $host->arrangement);
    }

    public function test_a_stop_attempt_orders_the_host_itself_which_answers_or_refuses(): void
    {
        $this->journal->owner()->showDriverArrangements()->chooseActiveAccounts()->idleAgent('Writer', 'writing-helper')
            ->enrollHost('Mac', [base_path()]);
        $opened = $this->journal->openRuntimeOn('Writer', 'Mac', base_path(), driverType: DriverType::Terminal);
        $first = $this->journal->openStopAttempt($opened->sessionId, 'stop-1');
        $second = $this->journal->openStopAttempt($opened->sessionId, 'stop-2');
        [$answered, $refused] = $this->journal->hostOrdersOn('Mac');

        $passed = [
            'status' => 'passed',
            'started_at' => '2026-11-26T10:00:00Z',
            'ended_at' => '2026-11-26T10:00:01Z',
            'exit_code' => 0,
            'signal' => null,
            'summary' => 'clean',
            'output' => 'clean',
            'truncated' => false,
        ];

        $this->journal->answerHostOrderWith($answered, ['results' => [$passed]])
            ->refuseHostOrder($refused, HostRefusal::Fenced);

        $this->journal->assertResult(
            [
                [
                    $first->refresh()->fence_order_id,
                    $second->refresh()->fence_order_id,
                ],
                HostOrderStatus::Done,
                HostOrderStatus::Refused,
            ],
            [[
                $answered->id,
                $refused->id,
            ], $answered->refresh()->status, $refused->refresh()->status],
        );
    }

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
                [
                    $open->refresh()->status,
                    $this->journal->service(ProcessFeed::class)->latestFrame($process)?->rows[0],
                ],
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

    public function test_an_idle_driver_worker_steps_with_no_query_and_ends_on_its_processes_end(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, StandInProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->openHostProcess('Mac', 'shell');
        $work = $this->journal->beginDriverWorker('shell');
        $this->journal->stepDriverWorker($work, 0);

        $idleQueries = $this->journal->queriesDuring(fn () => $this->journal->stepDriverWorker($work, 0));
        $this->journal->reportHostProcess('shell', HostProcessReportType::Exited, 0);

        $this->journal->assertResult([0, false], [$idleQueries, $this->journal->stepDriverWorker($work, 0)]);
    }

    public function test_a_process_driver_is_made_for_a_named_process_by_its_purpose(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, StandInProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->openHostProcess('Mac', 'shell');

        $this->journal->assertResult(true, $this->journal->processDriverOf('shell') instanceof StandInProcessDriver);
    }

    public function test_a_submitted_private_value_waits_for_the_host_its_write_was_ordered_on(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'shell')->submitPrivateValue('s-1', 'sk-1');
        $process = $this->journal->hostProcessCalled('shell');

        $this->journal->asSystem(new WriteHostPrivateValueCommand($process->id, 's-1', HostOrderSource::fromJournal()));

        $this->journal->assertResult(
            'sk-1',
            $this->journal->asSystem(new PullHostPrivateValueCommand($process->host_id, 's-1')),
        );
    }

    public function test_a_process_opened_for_a_start_is_linked_to_the_start_the_host_claimed(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
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

    public function test_passed_codex_probes_open_the_accounts_owner_whose_writes_read_back(): void
    {
        $this->journal->owner()->chooseActiveAccounts(config('accounts.root'))->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
        $opened = $this->journal->openCodexRuntimeOn('Driven', 'Mac', base_path());

        $this->journal->passCodexProbes('driven', $opened->runtimeId)->callAccountOwner('owner', $opened->runtimeId);

        $this->journal->beginDriverWorker('owner');

        $this->journal->assertResult(
            [true, HostProcessPurpose::AccountOwner, ['codex', 'app-server'], ['initialize']],
            [
                AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->hasProvenStart(),
                $this->journal->hostProcessCalled('owner')->purpose,
                array_slice($this->journal->payloadOf($this->journal->hostOrdersOf('owner')[0])['argv'], -2),
                array_column($this->journal->pipeInputOf('owner'), 'method'),
            ],
        );
    }

    public function test_a_hosts_own_process_is_called_by_its_purpose(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $this->journal->asSystem(new RequestHostProtectionCommand($this->journal->hostCalled('Box')->hostId));

        $this->journal->callHostProcessOf('relay', 'Box', HostProcessPurpose::RelayProbe);

        $this->journal->assertResult(HostProcessPurpose::RelayProbe, $this->journal->hostProcessCalled('relay')->purpose);
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

    public function test_a_driver_profile_is_the_one_the_journal_starts_its_family_by(): void
    {
        $this->journal->assertResult(DefaultDrivers::CODEX, $this->journal->driverProfile(DefaultDrivers::CODEX)->family());
    }

    public function test_a_swapped_driver_part_is_the_one_the_profile_uses(): void
    {
        $profile = $this->journal->withDriverPart(CodexSignInReader::class, AcceptingSignInReader::class)
            ->driverProfile(DefaultDrivers::CODEX);

        $this->journal->assertResult(true, $profile->hasAcceptedSignIn('not signed in', '/accounts/a'));
    }

    public function test_a_published_release_is_the_journals_current_one(): void
    {
        $this->journal->publishRelease('6.1.0');

        $this->journal->assertResult('6.1.0', $this->journal->service(PublishedReleases::class)->current()->version);
    }

    public function test_an_orders_payload_reads_back_as_the_host_receives_it(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'pipe', HostProcessType::Pipe);

        $payload = $this->journal->payloadOf($this->journal->hostOrdersOf('pipe')[0]);

        $this->journal->assertResult(['pipe', [
            'sh',
            '-c',
            'cat',
        ]], [$payload['type'], $payload['argv']]);
    }

    public function test_what_a_pipe_prints_follows_what_it_printed_before(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'pipe', HostProcessType::Pipe);

        $this->journal->printOnPipe('pipe', "one\n")->printOnPipe('pipe', "two\n");

        $process = $this->journal->hostProcessCalled('pipe');
        $chunks = array_map(
            fn ($entry) => [
                $entry->chunk?->offset,
                $entry->chunk?->printed(),
            ],
            $this->journal->service(ProcessFeed::class)->after($process->id, ProcessFeed::FIRST_CURSOR, 0),
        );
        $this->journal->assertResult([[
            [0, "one\n"],
            [4, "two\n"],
        ], 8], [$chunks, $process->output_offset]);
    }
}
