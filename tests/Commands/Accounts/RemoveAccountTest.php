<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\Accounts\RemoveAccount\RemoveAccountCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Accounts\AccountStatus;
use App\Enums\Accounts\SignInStatus;
use App\Exceptions\AccountUnavailable;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use App\Support\ActorContext;
use App\Support\Command;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use App\Values\OwnerAuthority;
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Removing an account cancels its running sign-in and leaves no replacement chosen.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
final class RemoveAccountTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
    use WithActiveAccount;

    private const string NO_DEFAULT_ACCOUNT = 'codex cannot be started now: no default account is chosen for it; '
        .'choose one in Accounts.';

    private const array TABLES = [
        'account_usage_windows',
        'account_usage_costs',
        'account_usage_tokens',
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'command_receipts',
        'links',
        'session_processes',
        'account_notices',
    ];

    private Account $account;

    protected function setUp(): void
    {
        parent::setUp();

        // The account folders of this test lie in the system's temporary folder, so the accounts root is that folder.
        config(['accounts.root' => sys_get_temp_dir()]);

        Bus::fake([SignInDeadline::class]);
        $this->account = $this->chooseActiveAccounts()['codex'];
    }

    public function test_removal_cancels_a_running_sign_in_and_leaves_no_replacement_chosen(): void
    {
        Account::create(DefaultDrivers::CODEX, AccountLabel::from('Home'), '/journal/accounts/home');
        $this->asOwner(new BeginSignInAgainCommand($this->account->id));
        $generation = $this->account->refresh()->sign_in_generation;

        $this->asOwner(new RemoveAccountCommand($this->account->id));
        $this->asOwner(new RemoveAccountCommand($this->account->id));

        $this->account->refresh();
        $this->assertSame(AccountStatus::Removing, $this->account->status);
        $this->assertSame($generation + 1, $this->account->sign_in_generation);
        $this->assertNull($this->account->live_writer_attempt_id);
        $this->assertSame(SignInStatus::Cancelled, SignInAttempt::query()->withoutGlobalScopes()->sole()->status);
        $this->assertNull(
            ActiveAccount::query()->withoutGlobalScopes()->where('account_protocol', 'codex')->value('account_id'),
        );
        $this->assertThrows(
            fn () => ActiveAccount::resolveLockedAccountForStart(DefaultDrivers::CODEX),
            AccountUnavailable::class,
            self::NO_DEFAULT_ACCOUNT,
        );
    }

    private function asOwner(Command $command): mixed
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );

        return $this->runOnBus($command);
    }
}
