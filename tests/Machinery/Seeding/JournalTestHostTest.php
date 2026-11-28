<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Agents\Drivers\Enums\DriverType;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use PHPUnit\Framework\AssertionFailedError;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Assertions\Assert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Hosts\EchoProcessDriver;
use Tests\Support\Hosts\Steps\CompletesBrowserSignIn;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\Mocks\Answer;
use Tests\Support\Mocks\CodexMock;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The test journal runs a host for real in the scope runTestHost() opens, and every verb of the running host acts on
 * it there: it opens the mock's echo program, proves starts, runs sign-ins and holds turns.
 */
#[TestsMachinery(TestJournal::class)]
#[TimeLimit(seconds: 60, reason: 'It runs the test host, the Docker mock and a served journal.')]
final class JournalTestHostTest extends TestCase
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
        'sign_in_attempts',
        'command_receipts',
        'session_processes',
        'inboxes',
        'inbox_members',
        'links',
        'users',
    ];

    public function test_a_stopped_real_host_leaves_no_process_of_its_served_journal(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->runTestHost('Mac', fn (TestHost $mac) => $mac
            ->assertStopsWholly());
    }

    public function test_the_running_host_is_reached_again_and_a_second_run_is_refused(): void
    {
        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->enrollHost('Pi', [base_path()])
            ->assertRefused(FixtureRefused::class, fn () => $this->journal->testHost(fn (TestHost $none) => $none
                ->stop()))
            ->runTestHost('Mac', fn (TestHost $mac) => $mac->holdTurns())
            ->assertRefused(
                FixtureRefused::class,
                fn () => $this->journal->runTestHost('Pi', fn (TestHost $pi) => $pi->stop()),
                fn (FixtureRefused $refused) => $this->assertStringContainsString('Mac', $refused->getMessage()),
            )
            ->testHost(fn (TestHost $mac) => $mac->releaseTurns())
            ->stopRunningHost();
    }

    public function test_a_real_host_opens_the_echo_program_the_journal_instructions(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac
                ->openEchoContainer('echo')
                ->process('echo', fn (TestHostProcess $echo) => $echo
                    ->waitFor(HostProcessStatus::Running)
                    ->driveUntil(fn (Assert $journal) => $journal->has('hostProcesses.echo.rows')))
                ->restartHost()
                ->process('echo', fn (TestHostProcess $echo) => $echo->waitFor(HostProcessStatus::Running)));

        $this->assertNotSame('', $this->journal->hostProcessCalled('echo')->execution_identity);
    }

    public function test_a_drive_that_never_holds_fails_with_the_last_miss_and_what_the_process_showed(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac
                ->openEchoContainer('echo')
                ->process('echo', fn (TestHostProcess $echo) => $echo->waitFor(HostProcessStatus::Running)))
            ->assertRefused(
                AssertionFailedError::class,
                fn () => $this->journal->hostProcess('echo', fn (TestHostProcess $echo) => $echo
                    ->driveUntil(fn (Assert $journal) => $journal
                        ->where('hostProcesses.echo.generation', 9), seconds: 1)),
                fn (AssertionFailedError $failure) => $this->assertStringContainsString(
                    'hostProcesses.echo.generation',
                    $failure->getMessage(),
                ),
            )
            ->assertResult(true, str_contains($this->journal->processReport('echo'), 'echo'))
            ->stopRunningHost();
    }

    public function test_a_real_host_reaches_its_journal_again_after_the_journal_restarted(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->runTestHost('Mac', fn (TestHost $mac) => $mac
            ->restartJournal()
            ->openEchoContainer('echo')
            ->process('echo', fn (TestHostProcess $echo) => $echo->waitFor(HostProcessStatus::Running))
            ->stop());
    }

    public function test_a_process_opened_with_start_credentials_sees_them_under_their_names(): void
    {
        $this->chooseActiveAccounts();
        $seen = tempnam(sys_get_temp_dir(), 'start-credentials-');
        $print = 'printf "%s" "$JOURNAL_START_TOKEN" > "$0"';

        $this->journal->owner()
            ->idleAgent('Probe')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac)
            ->withAgent('Probe', fn (TestAgent $probe) => $probe
                ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal))
            ->testHost(fn (TestHost $mac) => $mac
                ->openWithStartCredentials('probe', $this->journal->openedRuntimeOf('Probe')->runtimeId, [
                    'sh',
                    '-c',
                    $print,
                    $seen,
                ])
                ->process('probe', fn (TestHostProcess $probe) => $probe->waitFor(HostProcessStatus::Exited)));

        $this->journal->assertResult(64, strlen((string) file_get_contents($seen)));
    }

    public function test_a_terminal_start_proven_on_the_real_host_sends_the_stand_ins_screen(): void
    {
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Terminal')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac->chooseActiveAccounts())
            ->withAgent('Terminal', fn (TestAgent $terminal) => $terminal
                ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal)
                ->proveStart(HostProcessPurpose::AgentTerminal, 'terminal'))
            ->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal
                ->driveUntil(fn (Assert $journal) => $journal->has('hostProcesses.terminal.rows')))
            ->assertJournal(fn (Assert $journal) => $journal
                ->where(
                    'hostProcesses.terminal.rows',
                    fn (array $rows) => str_contains(implode("\n", $rows), 'Code v2.1.332'),
                )
                ->where('hostProcesses.terminal.purpose', HostProcessPurpose::AgentTerminal)
                ->count('testHost.claudeStarts', 1))
            ->stopRunningHost();
    }

    public function test_a_codex_terminal_on_a_real_host_runs_the_installed_stand_in_found_by_name(): void
    {
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Codex terminal')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac->chooseActiveAccounts())
            ->withAgent('Codex terminal', fn (TestAgent $codex) => $codex
                ->openRuntime(
                    'Mac',
                    base_path(),
                    driver: 'codex',
                    build: '0.172.0',
                    profile: 'codex',
                    driverType: DriverType::Terminal,
                    model: 'gpt-5.5',
                )
                ->proveStart(HostProcessPurpose::AgentTerminal, 'terminal'))
            ->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal
                ->driveUntil(fn (Assert $journal) => $journal->has('hostProcesses.terminal.rows')))
            ->assertJournal(fn (Assert $journal) => $journal
                ->where(
                    'hostProcesses.terminal.rows',
                    fn (array $rows) => str_contains(implode("\n", $rows), 'OpenAI Codex (v0.172.0)'),
                )
                ->count('testHost.codexStarts', 1)
                ->count('testHost.claudeStarts', 0))
            ->stopRunningHost();
    }

    public function test_a_sign_in_runs_on_the_real_host_and_its_challenge_reaches_the_test(): void
    {
        $codex = CodexMock::from('codex/0.172.0')
            ->expects('initialize', fn (Answer $answer) => $answer->replies('device-login'))
            ->expects('initialized', fn (Answer $answer) => $answer)
            ->expects('account/login/start', fn (Answer $answer) => $answer
                ->replies('device-login')
                ->waitsFor(CompletesBrowserSignIn::class)
                ->notifies('device-login', 'account/login/completed'))
            ->expects('account/read', fn (Answer $answer) => $answer->replies('device-login'));

        $this->journal->owner()
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac->mocks($codex)->shareSignIns())
            ->beginSignIn('codex', 'codex')
            ->testHost(fn (TestHost $mac) => $mac->startSignIns())
            ->awaitSignInChallenge('codex')
            ->testHost(fn (TestHost $mac) => $mac->completeBrowserSignIn()->waitForSignIns()->assertMocksPlayed())
            ->assertJournal(fn (Assert $journal) => $journal->where('signIns.codex.challenge.code', 'STAND-IN'))
            ->stopRunningHost();
    }

    public function test_the_key_recorder_on_a_real_host_records_what_was_typed(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac
                ->openKeyRecorder('keys')
                ->process('keys', fn (TestHostProcess $keys) => $keys
                    ->waitFor(HostProcessStatus::Running)
                    ->driveUntil(fn (Assert $journal) => $journal->has('hostProcesses.keys.rows'))
                    ->type('x')
                    ->driveUntil(fn (Assert $journal) => $journal->where('testHost.keysRecorded.keys', 'x'))))
            ->assertJournal(fn (Assert $journal) => $journal->where('testHost.keysRecorded', ['keys' => 'x']))
            ->stopRunningHost();
    }

    public function test_keys_typed_on_a_real_hosts_process_reach_its_program(): void
    {
        $typed = fn (Assert $journal) => $journal
            ->where('hostProcesses.echo.rows', fn (array|null $rows) => in_array('echo: typed', $rows ?? [], true));

        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac
                ->openEchoContainer('echo')
                ->process('echo', fn (TestHostProcess $echo) => $echo
                    ->waitFor(HostProcessStatus::Running)
                    ->driveUntil(fn (Assert $journal) => $journal->has('hostProcesses.echo.rows'))
                    ->type("typed\r")
                    ->driveUntil($typed)))
            ->assertJournal($typed)
            ->stopRunningHost();
    }

    public function test_the_claude_code_stand_in_plays_the_terminal_recording_a_test_names(): void
    {
        $recording = 'resources/recordings/claude-code/2.1.323/turns/terminal-interrupt/fixture.json';

        $this->journal->enrollHost('Mac', [base_path()])->runTestHost('Mac', function (TestHost $mac) use ($recording) {
            $mac->playClaudeTerminal('terminal-interrupt');

            $this->journal->assertResult(
                file_get_contents(base_path($recording)),
                file_get_contents("{$mac->installation()}/terminal-turn/fixture.json"),
            );
        })->stopRunningHost();
    }

    public function test_the_owner_completes_the_browser_sign_in_the_test_hosts_codex_waits_for(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->runTestHost('Mac', function (TestHost $mac) {
            $signedIn = "{$mac->installation()}/mocks/steps/CompletesBrowserSignIn";
            $before = file_exists($signedIn);
            $mac->completeBrowserSignIn();

            $this->journal->assertResult([false, true], [$before, file_exists($signedIn)]);
        })->stopRunningHost();
    }

    public function test_the_real_hosts_installation_holds_the_stand_in_whose_turns_are_held_and_released(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->runTestHost('Mac', function (TestHost $mac) {
            $installation = $mac->holdTurns()->installation();
            $held = file_exists("{$installation}/hold");
            $mac->releaseTurns();

            $this->journal->assertResult(
                [true, true, false, "{$mac->accountsFolder()}/codex"],
                [
                    is_executable("{$installation}/bin/claude"),
                    $held,
                    file_exists("{$installation}/hold"),
                    TestJournal::accountFolderOf($mac->accountsFolder(), 'codex'),
                ],
            );
        })->stopRunningHost();
    }
}
