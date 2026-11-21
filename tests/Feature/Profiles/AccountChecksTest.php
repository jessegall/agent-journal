<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Enums\DriverFailure;
use App\Agents\Events\DriverFailed;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Drivers\Enums\HookDriver;
use App\Files\Contracts\Files;
use App\Profiles\Commands\CheckAccount;
use App\Profiles\Enums\AccountCheckResult;
use App\Profiles\Enums\AccountNoticeReason;
use App\Profiles\Enums\AccountState;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Models\Account;
use App\Profiles\Models\AccountNotice;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Support\LocalAccountFolders;
use App\Profiles\Support\PrivateSignInProcesses;
use App\Profiles\Support\SignInProtocols;
use App\Profiles\Values\AccountLabel;
use App\Profiles\Values\ClaimedAccountCheck;
use Tests\Fixtures\Profiles\FinishingProtocol;
use Tests\Fixtures\Profiles\RecordingSignInHost;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Only a rejected sign-in seen in an account's current generation asks for a check, and only the host's certain
 * sign-out in that generation makes the account need a new sign-in; a check from before a newer sign-in changes
 * nothing.
 */
#[TimeLimit(seconds: 4, reason: 'It commits account changes through the bus and empties five tables per test.')]
final class AccountChecksTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'accounts',
        'active_accounts',
        'account_notices',
        'command_receipts',
        'sign_in_attempts',
    ];

    private Account $account;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $this->account = Account::create(HookDriver::Codex, AccountLabel::from('Work'), '/journal/accounts/work');
        ActiveAccount::lockedFor(HookDriver::Codex)->select($this->account);
    }

    public function test_only_a_rejected_sign_in_of_the_current_generation_asks_for_a_check(): void
    {
        $this->failWith(DriverFailure::RateLimit, 1);
        $this->failWith(DriverFailure::AuthenticationFailed, 0);
        $this->assertNull($this->account->refresh()->check_requested_generation);

        $this->failWith(DriverFailure::AuthenticationFailed, 1);

        $this->assertSame(1, $this->account->refresh()->check_requested_generation);
    }

    public function test_a_certain_sign_out_needs_a_new_sign_in_and_clears_the_choice(): void
    {
        $this->check(1, AccountCheckResult::Unknown);
        $this->assertSame(AccountState::SignedIn, $this->account->refresh()->state);

        $this->check(1, AccountCheckResult::SignedOut);

        $this->assertSame(AccountState::NeedsSignIn, $this->account->refresh()->state);
        $this->assertNull(ActiveAccount::query()->withoutGlobalScopes()->sole()->account_id);
        $notice = AccountNotice::query()->withoutGlobalScopes()->sole();
        $this->assertSame(AccountNoticeReason::NeedsSignIn, $notice->reason);
    }

    public function test_a_check_from_before_a_newer_sign_in_changes_nothing(): void
    {
        $this->check(0, AccountCheckResult::SignedOut);

        $this->assertSame(AccountState::SignedIn, $this->account->refresh()->state);
    }

    public function test_the_runner_reports_the_programs_own_certain_answer(): void
    {
        $host = new RecordingSignInHost(null);
        $host->nextCheck = new ClaimedAccountCheck(
            $this->account->id,
            'codex',
            SignInMethod::OAuth,
            sys_get_temp_dir(),
            1,
        );
        $protocols = new SignInProtocols($this->app);
        $protocols->register('codex', SignInMethod::OAuth, FinishingProtocol::class);

        $ran = new PrivateSignInProcesses($host, $protocols, static fn () => null, $this->app->make(Files::class), new LocalAccountFolders($this->app->make(Files::class)))->checkNext();

        $this->assertTrue($ran);
        $this->assertSame([AccountCheckResult::SignedIn], $host->checks);
    }

    private function failWith(DriverFailure $failure, int $generation): void
    {
        event(new DriverFailed('agent', 'session', 'codex', $failure, $this->account->recordIdentity(), $generation));
    }

    private function check(int $generation, AccountCheckResult $result): void
    {
        $this->app->make(EntryDispatchers::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CheckAccount('host', $this->account->id, $generation, $result),
        );
    }
}
