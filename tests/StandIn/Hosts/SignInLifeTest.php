<?php

declare(strict_types=1);

namespace Tests\StandIn\Hosts;

use App\Accounts\Commands\BeginSignIn\BeginSignInCommand;
use App\Accounts\Commands\BeginSignInAgain\BeginSignInAgainCommand;
use App\Accounts\Commands\SubmitSignInCode\SubmitSignInCodeCommand;
use App\Accounts\Enums\SignInMethod;
use App\Accounts\Enums\SignInStatus;
use App\Agents\Drivers\Enums\DriverType;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsAgainstStandIn;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The journal signs accounts in through a host's sign-in runner against the installed stand-ins: Claude Code shows an
 * address and takes the code the owner types, Codex completes a device-code login, and a sign-in again of an account
 * whose session runs first stops that session's processes.
 */
#[TestsAgainstStandIn]
#[TimeLimit(seconds: 60, reason: 'It runs the test host, its sign-in runner and a served journal.')]
final class SignInLifeTest extends TestCase
{
    use CommitsHookRows;

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
        'session_requests',
        'inboxes',
        'inbox_members',
        'links',
        'users',
    ];

    public function test_a_claude_code_account_is_signed_in_with_the_code_the_owner_types(): void
    {
        $this->arrangeTestHost();
        $started = $this->journal->asOwner(new BeginSignInCommand('claude-code', SignInMethod::OAuth));

        $this->journal->runSignInsOnTestHost();
        $challenge = $this->journal->signInChallengeOf($started->attemptId);
        $this->journal->asOwner(new SubmitSignInCodeCommand($started->attemptId, 'stand-in-code', 'code-1'));
        $this->journal->waitForSignInsOnTestHost();

        $this->journal->assertResult(
            ['claude.com', SignInStatus::Complete, 1],
            [
                parse_url($challenge->address, PHP_URL_HOST),
                SignInAttempt::query()->whereKey($started->attemptId)->sole()->status,
                Account::query()->where('account_protocol', 'claude-code')->count(),
            ],
        );
    }

    public function test_a_codex_account_is_signed_in_by_its_device_code_login(): void
    {
        $this->arrangeTestHost();
        $started = $this->journal->asOwner(new BeginSignInCommand('codex', SignInMethod::OAuth));

        $this->journal->runSignInsOnTestHost();
        $challenge = $this->journal->signInChallengeOf($started->attemptId);
        $this->journal->completeBrowserSignInOnTestHost()->waitForSignInsOnTestHost();

        $this->journal->assertResult(
            ['auth.openai.com', 'STAND-IN', SignInStatus::Complete, null, 1],
            [
                parse_url($challenge->address, PHP_URL_HOST),
                $challenge->code,
                SignInAttempt::query()->whereKey($started->attemptId)->sole()->status,
                SignInAttempt::query()->whereKey($started->attemptId)->sole()->refusal,
                Account::query()->where('account_protocol', 'codex')->count(),
            ],
        );
    }

    public function test_a_sign_in_again_of_an_account_whose_terminal_runs_stops_it_before_the_host_signs_in(): void
    {
        $this->arrangeTestHost();
        // The account is signed in through the host first, so it knows who it belongs to.
        $first = $this->journal->asOwner(new BeginSignInCommand('claude-code', SignInMethod::OAuth));
        $this->journal->runSignInsOnTestHost();
        $this->journal->signInChallengeOf($first->attemptId);
        $this->journal->asOwner(new SubmitSignInCodeCommand($first->attemptId, 'stand-in-code', 'code-1'));
        $this->journal->waitForSignInsOnTestHost();
        $account = Account::query()->where('account_protocol', 'claude-code')->sole();
        $this->journal->idleAgent('Terminal');
        $opened = $this->journal->openRuntimeOn('Terminal', 'Mac', base_path(), driverType: DriverType::Terminal);
        $this->journal->proveStartOnTestHost($opened->runtimeId, HostProcessPurpose::AgentTerminal, 'terminal')
            ->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal->waitFor(HostProcessStatus::Running));

        $again = $this->journal->asOwner(new BeginSignInAgainCommand($account->id));
        $this->artisan('accounts:reconcile')->assertSuccessful();
        $this->journal->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal->waitFor(HostProcessStatus::Exited, seconds: 15));
        $this->artisan('accounts:reconcile')->assertSuccessful();
        $this->journal->runSignInsOnTestHost();
        $this->journal->signInChallengeOf($again->attemptId);
        $this->journal->asOwner(new SubmitSignInCodeCommand($again->attemptId, 'stand-in-code', 'code-2'));
        $this->journal->waitForSignInsOnTestHost();

        $this->journal->assertResult(
            SignInStatus::Complete,
            SignInAttempt::query()->whereKey($again->attemptId)->sole()->status,
        );
    }

    private function arrangeTestHost(): void
    {
        $this->journal->owner()
            ->showDriverArrangements()
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac')
            ->shareSignInsWithTestHost();
    }
}
