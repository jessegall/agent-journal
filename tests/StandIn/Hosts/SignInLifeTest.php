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
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The journal signs accounts in through a host's sign-in runner against the installed stand-ins: Claude Code shows an
 * address and takes the code the owner types, Codex completes a device-code login, and a sign-in again of an account
 * whose session runs first stops that session's processes.
 */
#[TestsAgainstStandIn]
#[TimeLimit(seconds: 60, reason: 'It runs the real host, its sign-in runner and a served journal.')]
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
        $this->arrangeRealHost();
        $started = $this->journal->asOwner(new BeginSignInCommand('claude-code', SignInMethod::OAuth));

        $this->journal->runSignInsOnRealHost();
        $challenge = $this->journal->signInChallengeOf($started->attemptId);
        $this->journal->asOwner(new SubmitSignInCodeCommand($started->attemptId, 'stand-in-code', 'code-1'));
        $this->journal->waitForSignInsOnRealHost();

        $this->journal->assertResult(
            ['claude.ai', SignInStatus::Complete, 1],
            [
                parse_url($challenge->address, PHP_URL_HOST),
                SignInAttempt::query()->whereKey($started->attemptId)->sole()->status,
                Account::query()->where('account_protocol', 'claude-code')->count(),
            ],
        );
    }

    public function test_a_codex_account_is_signed_in_by_its_device_code_login(): void
    {
        $this->arrangeRealHost();
        $started = $this->journal->asOwner(new BeginSignInCommand('codex', SignInMethod::OAuth));

        $this->journal->runSignInsOnRealHost();
        $challenge = $this->journal->signInChallengeOf($started->attemptId);
        $this->journal->waitForSignInsOnRealHost();

        $this->journal->assertResult(
            ['auth.openai.com', 'STAND-IN', SignInStatus::Complete, 1],
            [
                parse_url($challenge->address, PHP_URL_HOST),
                $challenge->code,
                SignInAttempt::query()->whereKey($started->attemptId)->sole()->status,
                Account::query()->where('account_protocol', 'codex')->count(),
            ],
        );
    }

    public function test_a_sign_in_again_of_an_account_whose_terminal_runs_stops_it_before_the_host_signs_in(): void
    {
        $this->arrangeRealHost();
        $this->journal->chooseActiveAccountsOnRealHost()->idleAgent('Terminal');
        $opened = $this->journal->openRuntimeOn('Terminal', 'Mac', base_path(), driverType: DriverType::Terminal);
        $this->journal->proveStartOnRealHost($opened->runtimeId, HostProcessPurpose::AgentTerminal, 'terminal')
            ->waitForHostProcess('terminal', HostProcessStatus::Running);
        $account = $this->journal->chosenAccounts()['claude-code'];

        $again = $this->journal->asOwner(new BeginSignInAgainCommand($account->id));
        $this->artisan('accounts:reconcile')->assertSuccessful();
        $this->journal->waitForHostProcess('terminal', HostProcessStatus::Exited, seconds: 15);
        $this->artisan('accounts:reconcile')->assertSuccessful();
        $this->journal->runSignInsOnRealHost();
        $this->journal->signInChallengeOf($again->attemptId);
        $this->journal->asOwner(new SubmitSignInCodeCommand($again->attemptId, 'stand-in-code', 'code-1'));
        $this->journal->waitForSignInsOnRealHost();

        $this->journal->assertResult(
            SignInStatus::Complete,
            SignInAttempt::query()->whereKey($again->attemptId)->sole()->status,
        );
    }

    private function arrangeRealHost(): void
    {
        $this->journal->owner()
            ->showDriverArrangements()
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac')
            ->shareSignInsWithRealHost();
    }
}
