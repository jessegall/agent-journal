<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Accounts\Enums\SignInMethod;
use App\Agents\Drivers\Codex\CodexSignInReader;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Enums\MarkTone;
use App\Agents\Drivers\Enums\SignInCodeDirection;
use App\Agents\Drivers\Work\DriverSupervisor;
use App\Agents\Enums\SessionProcessStatus;
use App\Agents\Values\ProviderKey;
use App\Connections\PublishedReleases;
use App\Hosts\ArrangementSetting;
use App\Hosts\Commands\PullHostPrivateValue\PullHostPrivateValueCommand;
use App\Hosts\Commands\WriteHostPrivateValue\WriteHostPrivateValueCommand;
use App\Hosts\Enums\DriverImageStatus;
use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\ProcessFeed;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\HostProcessType;
use App\Hosts\Protocol\HostRefusal;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Projects\Enums\ArrangementType;
use App\Support\AgentImage;
use App\Values\DriverFamily;
use App\Values\HostInstructionSource;
use App\Values\HostProcessPlan;
use Illuminate\Contracts\Config\Repository;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Assertions\Assert;
use Tests\Support\Drivers\AcceptingSignInReader;
use Tests\Support\Drivers\MockProcessDriver;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The test journal opens a host's processes through their real open instruction and moves them by their host's reports.
 */
#[TestsMachinery(TestJournal::class)]
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
            ['low', 'medium', 'high', 'high'],
            'medium',
            [],
            'images/drivers/example.svg',
            MarkTone::CurrentColor,
            SignInCodeDirection::Outgoing,
        );

        $this->journal->setUpDriverFamily($family, DefaultDrivers::CLAUDE_CODE);

        $added = $this->journal->driverProfile('example');
        $claude = $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE);

        $this->journal->assertResult(
            ['example', $claude->hookAdapter()::class, $claude->signInProtocolBy(SignInMethod::OAuth)],
            [$added->family(), $added->hookAdapter()::class, $added->signInProtocolBy(SignInMethod::OAuth)],
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

    public function test_a_journal_that_forgets_its_security_profiles_knows_no_profiles_folder(): void
    {
        $this->journal->arrangeContainedJournal()->forgetSecurityProfiles();

        $this->journal->assertResult('', $this->app->make(Repository::class)->get('journal.agents.security_profiles'));
    }

    public function test_a_contained_journal_freezes_its_sessions_into_the_agent_image(): void
    {
        $this->journal->arrangeContainedJournal();
        $arrangement = $this->app->make(ArrangementSetting::class);

        $this->journal->assertResult(
            [true, TestHost::IMAGE, TestHost::INSTALLATION_NAME.'-s1'],
            [
                $arrangement->arrangement->isContained(),
                $this->app->make(AgentImage::class)->reference,
                $arrangement->sessionContainerName('s1'),
            ],
        );
    }

    public function test_a_contained_host_is_enrolled_contained(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);

        $host = Host::query()->whereKey($this->journal->hostCalled('Box')->hostId)->sole();
        $this->journal->assertResult(ArrangementType::Contained, $host->arrangement);
    }

    public function test_a_contained_host_can_hold_its_driver_images_ready(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()])->readyDriverImagesOn('Box');

        $statuses = HostDriverImage::query()->where('host_id', $this->journal->hostCalled('Box')->hostId)->pluck('status');
        $this->journal->assertResult([DriverImageStatus::Ready, DriverImageStatus::Ready], $statuses->all());
    }

    public function test_a_stop_attempt_instructs_the_host_itself_which_answers_or_refuses(): void
    {
        $this->journal->owner()->showDriverArrangements()->chooseActiveAccounts()->idleAgent('Writer', 'writing-helper')
            ->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Writer', fn (TestAgent $writer) => $writer
            ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal));
        $opened = $this->journal->openedRuntimeOf('Writer');
        $first = $this->journal->openStopAttempt($opened->sessionId, 'stop-1');
        $second = $this->journal->openStopAttempt($opened->sessionId, 'stop-2');
        [$answered, $refused] = $this->journal->hostInstructionsOn('Mac');

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

        $this->journal->hostInstruction($answered, fn (TestHostInstruction $instruction) => $instruction->answerWith(['results' => [$passed]]))
            ->hostInstruction($refused, fn (TestHostInstruction $instruction) => $instruction->refuse(HostRefusal::Fenced));

        $this->journal->assertResult(
            [
                [
                    $first->refresh()->fence_instruction_id,
                    $second->refresh()->fence_instruction_id,
                ],
                HostInstructionStatus::Done,
                HostInstructionStatus::Refused,
            ],
            [[
                $answered->id,
                $refused->id,
            ], $answered->refresh()->status, $refused->refresh()->status],
        );
    }

    public function test_a_planned_process_is_opened_by_its_instruction_and_a_process_is_named_by_its_id_once(): void
    {
        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            HostProcessType::Pipe,
            RestartPolicy::Never,
            ['cat'],
            [],
            base_path(),
        );

        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->openPlannedProcess('Mac', 'planned', $plan)
            ->nameHostProcess('same', $this->journal->hostProcessCalled('planned')->id)
            ->assertJournal(fn (Assert $journal) => $journal
                ->where('hostProcesses.planned.purpose', HostProcessPurpose::Probe)
                ->where('hostProcesses.same.purpose', HostProcessPurpose::Probe))
            ->assertRefused(
                FixtureRefused::class,
                fn (TestJournal $journal) => $journal
                    ->nameHostProcess('same', $journal->hostProcessCalled('planned')->id),
            );
    }

    public function test_an_unknown_process_name_fails_naming_the_processes_the_test_named(): void
    {
        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell'))
            ->assertRefused(
                FixtureRefused::class,
                fn (TestJournal $journal) => $journal
                    ->hostProcess('nope', fn (TestHostProcess $nope) => $nope->drive()),
                fn (FixtureRefused $refused) => $this->assertStringContainsString('shell', $refused->getMessage()),
            );
    }

    public function test_a_process_answers_its_oldest_open_instruction_in_its_own_scope(): void
    {
        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell')->markAnswered())
            ->hostProcess('shell', fn (TestHostProcess $shell) => $shell
                ->instruction(fn (TestHostInstruction $open) => $open->answer()))
            ->assertJournal(fn (Assert $journal) => $journal->count(
                'hostProcesses.shell.instructions',
                1,
                fn (Assert $open) => $open->where('status', HostInstructionStatus::Done)->etc(),
            ));
    }

    public function test_a_process_is_opened_by_its_instruction_and_moved_by_its_hosts_report(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('pipe', HostProcessType::Pipe));
        [$open] = $this->journal->hostInstructionsOf('pipe');

        $this->journal->hostProcess('pipe', fn (TestHostProcess $pipe) => $pipe
            ->report(HostProcessReportType::Running));

        $this->journal->assertResult(
            [HostInstructionType::OpenProcess, HostProcessType::Pipe, HostProcessStatus::Running, 'pid:pipe'],
            [
                $open->type,
                $this->journal->hostProcessCalled('pipe')->type,
                $this->journal->hostProcessCalled('pipe')->status,
                $this->journal->hostProcessCalled('pipe')->execution_identity,
            ],
        );
    }

    public function test_a_driven_process_prints_has_its_instruction_answered_and_its_worker_started(): void
    {
        $this->journal
            ->fakeStartedPrograms()
            ->driveProcessesWith(HostProcessPurpose::Probe, MockProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell'))
            ->hostProcess('shell', fn (TestHostProcess $shell) => $shell->print('ready'));
        [$open] = $this->journal->hostInstructionsOf('shell');
        $process = $this->journal->hostProcessCalled('shell')->id;

        $this->journal->hostInstruction($open, fn (TestHostInstruction $instruction) => $instruction->answer());
        $this->journal->service(DriverSupervisor::class)->startNeeded();

        $this->journal
            ->assertProgramStarted(['php', 'artisan', 'drivers:work', $process])
            ->assertResult(
                [HostInstructionStatus::Done, 'ready'],
                [
                    $open->refresh()->status,
                    $this->journal->service(ProcessFeed::class)->latestFrame($process)?->rows[0],
                ],
            );
    }

    public function test_a_driver_worker_begins_on_a_process_and_steps_on_what_it_prints(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, MockProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell'))
            ->hostProcess('shell', fn (TestHostProcess $shell) => $shell->beginWorker()->print('> ')->drive())
            ->assertJournal(fn (Assert $journal) => $journal->where('hostProcesses.shell.workerGeneration', 1));
    }

    public function test_an_idle_driver_worker_steps_with_no_query_and_ends_on_its_processes_end(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, MockProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell'))
            ->hostProcess('shell', fn (TestHostProcess $shell) => $shell->beginWorker()->drive(0));

        $idleQueries = $this->journal->queriesDuring(
            fn () => $this->journal->hostProcess('shell', fn (TestHostProcess $shell) => $shell->drive(0)),
        );

        $this->journal
            ->hostProcess('shell', fn (TestHostProcess $shell) => $shell
                ->report(HostProcessReportType::Exited, 0)->drive(0))
            ->assertResult(0, $idleQueries)
            ->assertJournal(fn (Assert $journal) => $journal
                ->where('hostProcesses.shell.status', HostProcessStatus::Exited));
    }

    public function test_a_process_driver_is_made_for_a_named_process_by_its_purpose(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, MockProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell'));

        $this->journal->assertResult(true, $this->journal->processDriverOf('shell') instanceof MockProcessDriver);
    }

    public function test_a_submitted_private_value_waits_for_the_host_its_write_was_ordered_on(): void
    {
        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell'))
            ->hostProcess('shell', fn (TestHostProcess $shell) => $shell->submitPrivateValue('s-1', 'sk-1'));
        $process = $this->journal->hostProcessCalled('shell');

        $this->journal->asSystem(new WriteHostPrivateValueCommand($process->id, 's-1', HostInstructionSource::fromJournal()));

        $this->journal->assertResult(
            'sk-1',
            $this->journal->asSystem(new PullHostPrivateValueCommand($process->host_id, 's-1')),
        );
    }

    public function test_a_process_opened_for_a_start_is_linked_to_the_start_the_host_claimed(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal));
        $opened = $this->journal->openedRuntimeOf('Driven');

        $this->journal->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcessForStart('agent', $opened->sessionId, HostProcessPurpose::AgentTurn));

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
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven->openRuntime('Mac', base_path()));
        $opened = $this->journal->openedRuntimeOf('Driven');

        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('probe', HostProcessPurpose::BuildProbe));

        $process = $this->journal->hostProcessCalled('probe');
        $this->journal->assertResult(
            [$opened->runtimeId, HostProcessPurpose::BuildProbe],
            [$process->agent_runtime_id, $process->purpose],
        );
    }

    public function test_a_passed_build_probe_instructs_the_sign_in_probe(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven->openRuntime('Mac', base_path()));
        $opened = $this->journal->openedRuntimeOf('Driven');

        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven->passBuildProbe('driven'));

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
        $this->journal
            ->owner()
            ->chooseActiveAccounts(config('journal.accounts.root'))
            ->showDriverArrangements()
            ->idleAgent('Driven')
            ->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven->openCodexRuntime('Mac', base_path()));
        $opened = $this->journal->openedRuntimeOf('Driven');

        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->passCodexProbes('driven')->callAccountOwner('owner'));

        $this->journal->hostProcess('owner', fn (TestHostProcess $owner) => $owner->beginWorker());

        $this->journal->assertResult(
            [true, HostProcessPurpose::AccountOwner, ['codex', 'app-server'], ['initialize']],
            [
                AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->hasProvenStart(),
                $this->journal->hostProcessCalled('owner')->purpose,
                array_slice($this->journal->payloadOf($this->journal->hostInstructionsOf('owner')[0])['argv'], -2),
                array_column($this->journal->pipeInputOf('owner'), 'method'),
            ],
        );
    }

    public function test_shown_driver_arrangements_let_the_journal_take_a_headless_start(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);

        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven->openRuntime('Mac', base_path()));
        $opened = $this->journal->openedRuntimeOf('Driven');

        $this->journal->assertResult(
            SessionProcessStatus::Starting,
            $this->journal->startOfSession($opened->sessionId)->status,
        );
    }

    public function test_a_driver_profile_is_the_one_the_journal_starts_its_family_by(): void
    {
        $this->journal->assertResult(
            DefaultDrivers::CODEX,
            $this->journal->driverProfile(DefaultDrivers::CODEX)->family(),
        );
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

    public function test_an_instructions_payload_reads_back_as_the_host_receives_it(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('pipe', HostProcessType::Pipe));

        $payload = $this->journal->payloadOf($this->journal->hostInstructionsOf('pipe')[0]);

        $this->journal->assertResult(['pipe', [
            'sh',
            '-c',
            'cat',
        ]], [$payload['type'], $payload['argv']]);
    }

    public function test_what_a_pipe_prints_follows_what_it_printed_before(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('pipe', HostProcessType::Pipe));

        $this->journal->hostProcess('pipe', fn (TestHostProcess $pipe) => $pipe
            ->printOnPipe("one\n")->printOnPipe("two\n"));

        $process = $this->journal->hostProcessCalled('pipe');
        $chunks = array_map(
            fn ($entry) => [
                $entry->chunk?->offset,
                $entry->chunk === null ? null : $entry->printed(),
            ],
            $this->journal->service(ProcessFeed::class)->after($process->id, ProcessFeed::FIRST_CURSOR, 0),
        );
        $this->journal->assertResult([[
            [0, "one\n"],
            [4, "two\n"],
        ], 8], [$chunks, $process->output_offset]);
    }
}
