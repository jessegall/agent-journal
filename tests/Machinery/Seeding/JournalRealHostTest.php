<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Drivers\DriverType;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessStatus;
use App\Support\Hosts\ProcessFeed;
use Tests\Support\CommitsHookRows;
use Tests\Support\Hosts\EchoProcessDriver;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The test journal runs a host for real and opens the stand-in's echo program on it, then waits for its report.
 */
#[TimeLimit(seconds: 60, reason: 'It runs the real host, the Docker stand-in and a served journal.')]
final class JournalRealHostTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_orders',
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

    public function test_a_real_host_opens_the_echo_program_the_journal_orders(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac')
            ->openEchoContainer('Mac', 'echo')
            ->waitForHostProcess('echo', HostProcessStatus::Running);
        $process = $this->journal->hostProcessCalled('echo')->id;
        $feed = $this->journal->service(ProcessFeed::class);

        $this->journal->driveHostProcess('echo', fn () => $feed->latestFrame($process) !== null);
        $this->journal->restartRealHost()->waitForHostProcess('echo', HostProcessStatus::Running);

        $this->assertNotSame('', $this->journal->hostProcessCalled('echo')->execution_identity);
    }

    public function test_a_real_host_reaches_its_journal_again_after_the_journal_restarted(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->runRealHost('Mac')->restartJournalOfRealHost();

        $this->journal
            ->openEchoContainer('Mac', 'echo')
            ->waitForHostProcess('echo', HostProcessStatus::Running)
            ->stopRealHost();
    }

    public function test_a_process_opened_with_start_credentials_sees_them_under_their_names(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->idleAgent('Probe')->enrollHost('Mac', [base_path()])->runRealHost('Mac');
        $opened = $this->journal->openRuntimeOn('Probe', 'Mac', base_path(), driverType: DriverType::Terminal);
        $seen = tempnam(sys_get_temp_dir(), 'start-credentials-');
        $print = 'printf "%s" "$JOURNAL_START_TOKEN" > "$0"';

        $this->journal
            ->openWithStartCredentials('Mac', 'probe', $opened->runtimeId, ['sh', '-c', $print, $seen])
            ->waitForHostProcess('probe', HostProcessStatus::Exited);

        $this->assertSame(64, strlen((string) file_get_contents($seen)));
    }

    public function test_a_terminal_start_proven_on_the_real_host_sends_the_stand_ins_screen(): void
    {
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Terminal')
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac')
            ->chooseActiveAccountsOnRealHost();
        $opened = $this->journal->openRuntimeOn('Terminal', 'Mac', base_path(), driverType: DriverType::Terminal);

        $this->journal->proveStartOnRealHost($opened->runtimeId, HostProcessPurpose::AgentTerminal, 'terminal')
            ->driveHostProcess('terminal', fn () => $this->journal->hostProcessRows('terminal') !== []);

        $this->journal->assertResult(
            [true, HostProcessPurpose::AgentTerminal, 1],
            [
                str_contains(implode("\n", $this->journal->hostProcessRows('terminal')), 'Code v2.1.323'),
                $this->journal->hostProcessCalled('terminal')->purpose,
                count($this->journal->realHostClaudeStarts()),
            ],
        );
        $this->journal->stopRealHost();
    }

    public function test_a_codex_terminal_on_a_real_host_runs_the_installed_stand_in_found_by_name(): void
    {
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Codex terminal')
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac')
            ->chooseActiveAccountsOnRealHost();
        $opened = $this->journal->openRuntimeOn(
            'Codex terminal',
            'Mac',
            base_path(),
            driver: 'codex',
            build: '0.165.0',
            profile: 'codex',
            driverType: DriverType::Terminal,
            model: 'gpt-5.5',
        );

        $this->journal->proveStartOnRealHost($opened->runtimeId, HostProcessPurpose::AgentTerminal, 'terminal')
            ->driveHostProcess('terminal', fn () => $this->journal->hostProcessRows('terminal') !== []);

        $this->journal->assertResult(
            [true, 1, []],
            [
                str_contains(implode("\n", $this->journal->hostProcessRows('terminal')), 'OpenAI Codex (v0.165.0)'),
                count($this->journal->realHostCodexStarts()),
                $this->journal->realHostClaudeStarts(),
            ],
        );
        $this->journal->stopRealHost();
    }

    public function test_a_sign_in_runs_on_the_real_host_and_its_challenge_reaches_the_test(): void
    {
        $this->journal->owner()->enrollHost('Mac', [base_path()])->runRealHost('Mac')->shareSignInsWithRealHost();
        $started = $this->journal->asOwner(new BeginSignInCommand('codex', SignInMethod::OAuth));

        $challenge = $this->journal->runSignInsOnRealHost()->signInChallengeOf($started->attemptId);
        $this->journal->waitForSignInsOnRealHost();

        $this->journal->assertResult('STAND-IN', $challenge->code);
        $this->journal->stopRealHost();
    }

    public function test_the_key_recorder_on_a_real_host_records_what_was_typed(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac')
            ->openKeyRecorder('Mac', 'keys')
            ->waitForHostProcess('keys', HostProcessStatus::Running);
        $work = $this->journal->driveHostProcess('keys', fn () => $this->journal->hostProcessRows('keys') !== []);

        $this->journal->typeOnHostProcess('keys', 'x')
            ->driveHostProcess('keys', fn () => $this->journal->keysRecordedBy('keys') === 'x', $work);

        $this->journal->assertResult('x', $this->journal->keysRecordedBy('keys'));
        $this->journal->stopRealHost();
    }

    public function test_keys_typed_on_a_real_hosts_process_reach_its_program(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac')
            ->openEchoContainer('Mac', 'echo')
            ->waitForHostProcess('echo', HostProcessStatus::Running);
        $process = $this->journal->hostProcessCalled('echo')->id;
        $feed = $this->journal->service(ProcessFeed::class);
        $work = $this->journal->driveHostProcess('echo', fn () => $feed->latestFrame($process) !== null);

        $this->journal->typeOnHostProcess('echo', "typed\r")->driveHostProcess(
            'echo',
            fn () => in_array('echo: typed', $feed->latestFrame($process)->rows ?? [], true),
            $work,
        );

        $this->journal->assertResult(true, in_array('echo: typed', $feed->latestFrame($process)->rows ?? [], true));
        $this->journal->stopRealHost();
    }

    public function test_the_real_hosts_installation_holds_the_stand_in_whose_turns_are_held_and_released(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->runRealHost('Mac')->holdStandInTurns();
        $installation = $this->journal->realHostInstallation();
        $held = file_exists("{$installation}/hold");

        $this->journal->releaseStandInTurns();

        $this->journal->assertResult(
            [true, true, false],
            [is_executable("{$installation}/bin/claude"), $held, file_exists("{$installation}/hold")],
        );
        $this->journal->stopRealHost();
    }
}
