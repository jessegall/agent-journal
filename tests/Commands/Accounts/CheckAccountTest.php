<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\CheckAccount\CheckAccountCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Accounts\AccountCheckResult;
use App\Enums\Accounts\AccountNoticeReason;
use App\Enums\Accounts\AccountStatus;
use App\Enums\Accounts\CommandEntry;
use App\Models\Accounts\Account;
use App\Models\Accounts\AccountNotice;
use App\Models\Accounts\ActiveAccount;
use App\Support\ActorContext;
use App\Support\DefaultDrivers;
use App\Support\JournalCommands;
use App\Values\AccountLabel;
use App\Values\OwnerAuthority;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A certain sign-out needs a new sign-in and clears the choice, and a check from before a newer sign-in changes
 * nothing.
 */
#[TimeLimit(seconds: 4, reason: 'It commits account changes through the bus and empties five tables per test.')]
final class CheckAccountTest extends TestCase
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
        $this->account = Account::create(DefaultDrivers::CODEX, AccountLabel::from('Work'), '/journal/accounts/work');
        ActiveAccount::findLockedFor(DefaultDrivers::CODEX)->select($this->account);
    }

    public function test_a_certain_sign_out_needs_a_new_sign_in_and_clears_the_choice(): void
    {
        $this->check(1, AccountCheckResult::Unknown);
        $this->assertSame(AccountStatus::Authenticated, $this->account->refresh()->status);

        $this->check(1, AccountCheckResult::SignedOut);

        $this->assertSame(AccountStatus::Unauthenticated, $this->account->refresh()->status);
        $this->assertNull(ActiveAccount::query()->withoutGlobalScopes()->sole()->account_id);
        $notice = AccountNotice::query()->withoutGlobalScopes()->sole();
        $this->assertSame(AccountNoticeReason::NeedsSignIn, $notice->reason);
    }

    public function test_a_check_from_before_a_newer_sign_in_changes_nothing(): void
    {
        $this->check(0, AccountCheckResult::SignedOut);

        $this->assertSame(AccountStatus::Authenticated, $this->account->refresh()->status);
    }

    private function check(int $generation, AccountCheckResult $result): void
    {
        $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CheckAccountCommand('host', $this->account->id, $generation, $result),
        );
    }
}
