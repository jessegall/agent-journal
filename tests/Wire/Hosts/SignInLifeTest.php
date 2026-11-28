<?php

declare(strict_types=1);

namespace Tests\Wire\Hosts;

use App\Accounts\Enums\SignInStatus;
use App\Agents\Drivers\Enums\DriverType;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Models\Accounts\Account;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Assertions\Assert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\OverTheWire;
use Tests\Support\Hosts\Steps\CompletesBrowserSignIn;
use Tests\Support\Hosts\Steps\ShowsChallenge;
use Tests\Support\Hosts\Steps\SignsIn;
use Tests\Support\Hosts\Steps\StartsSignIn;
use Tests\Support\Hosts\Steps\TypesCode;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\Mocks\Answer;
use Tests\Support\Mocks\ClaudeMock;
use Tests\Support\Mocks\CodexMock;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The journal signs accounts in through a host's sign-in runner against the installed mocks: Claude Code shows an
 * address and takes the code the owner types, Codex completes a device-code login, and a sign-in again of an account
 * whose session runs first stops that session's processes.
 */
#[OverTheWire]
#[TimeLimit(seconds: 60, reason: 'It runs the test host, its sign-in runner and a served journal.')]
final class SignInLifeTest extends TestCase
{
    use CommitsHookRows;

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
        'session_requests',
        'inboxes',
        'inbox_members',
        'links',
        'users',
    ];

    public function test_a_claude_code_account_is_signed_in_with_the_code_the_owner_types(): void
    {
        $claude = ClaudeMock::from('claude-code/2.1.332')
            ->expectsCode(fn (Answer $answer) => $answer->replies('login-with-code'));

        $this->journal->owner()
            ->showDriverArrangements()
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac
                ->mocks($claude)
                ->shareSignIns()
                ->scenario(
                    StartsSignIn::of('claude-code'),
                    ShowsChallenge::class,
                    TypesCode::of('claude-code', 'mock-code', 'code-1'),
                    SignsIn::class,
                ))
            ->assertJournal(fn (Assert $journal) => $journal
                ->has('signIns.claude-code', fn (Assert $signIn) => $signIn
                    ->where('status', SignInStatus::Complete)
                    ->where('challenge.host', 'claude.com')
                    ->etc())
                ->count('accounts', 1));
    }

    public function test_a_codex_account_is_signed_in_by_its_device_code_login(): void
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
            ->showDriverArrangements()
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac
                ->mocks($codex)
                ->shareSignIns()
                ->scenario(
                    StartsSignIn::of('codex'),
                    ShowsChallenge::class,
                    CompletesBrowserSignIn::class,
                    SignsIn::class,
                ))
            ->assertJournal(fn (Assert $journal) => $journal->has('signIns.codex', fn (Assert $signIn) => $signIn
                ->where('status', SignInStatus::Complete)
                ->where('challenge.host', 'auth.openai.com')
                ->where('challenge.code', 'STAND-IN')
                ->missing('refusal')
                ->has('account')
                ->etc()));
    }

    public function test_a_sign_in_again_of_an_account_whose_terminal_runs_stops_it_before_the_host_signs_in(): void
    {
        $claude = ClaudeMock::from('claude-code/2.1.332')
            ->expectsCode(fn (Answer $answer) => $answer->replies('login-with-code'))
            ->expectsCode(fn (Answer $answer) => $answer->replies('login-with-code'));

        // The account is signed in through the host first, so it knows who it belongs to.
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Terminal')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac
                ->mocks($claude)
                ->shareSignIns()
                ->scenario(
                    StartsSignIn::of('claude-code', 'first'),
                    ShowsChallenge::class,
                    TypesCode::of('first', 'mock-code', 'code-1'),
                    SignsIn::class,
                ))
            ->withAgent('Terminal', fn (TestAgent $terminal) => $terminal
                ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal)
                ->proveStart(HostProcessPurpose::AgentTerminal, 'terminal'))
            ->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal->waitFor(HostProcessStatus::Running))
            ->beginSignInAgain('again', Account::query()->where('account_protocol', 'claude-code')->sole());
        $this->artisan('accounts:reconcile')->assertSuccessful();
        $this->journal->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal
            ->waitFor(HostProcessStatus::Exited, seconds: 15));
        $this->artisan('accounts:reconcile')->assertSuccessful();

        $this->journal
            ->testHost(fn (TestHost $mac) => $mac->startSignIns()->scenario(
                ShowsChallenge::of('again'),
                TypesCode::of('again', 'mock-code', 'code-2'),
                SignsIn::class,
            ))
            ->assertJournal(fn (Assert $journal) => $journal->where('signIns.again.status', SignInStatus::Complete));
    }
}
