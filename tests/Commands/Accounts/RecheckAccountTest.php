<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\Accounts\CancelSignIn\CancelSignInCommand;
use App\Commands\Accounts\CheckAccount\CheckAccountCommand;
use App\Commands\Accounts\RecheckAccount\RecheckAccountCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Accounts\AccountCheckResult;
use App\Enums\Accounts\CommandEntry;
use App\Exceptions\AccountRecheckRefused;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Support\Command;
use App\Support\JournalCommands;
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * An inconclusive check waits for the owner's recheck.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
final class RecheckAccountTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'users',
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

        $this->journal->owner();

        Bus::fake([SignInDeadline::class]);
        $this->account = $this->chooseActiveAccounts()['codex'];
        $this->account->forceFill(['subject' => 'subject-1'])->save();
    }

    public function test_an_inconclusive_check_waits_for_the_owners_recheck(): void
    {
        $this->cancel($this->again('tab-1'));
        $generation = $this->account->refresh()->sign_in_generation;

        $this->asHost(new CheckAccountCommand('host', $this->account->id, $generation, AccountCheckResult::Unknown));

        $this->assertTrue($this->account->refresh()->isCheckInconclusive());
        $this->assertNull(Account::findNextDueForCheck());

        $this->journal->actAs('Owner');
        $this->app->make(CommandBus::class)->run(new RecheckAccountCommand($this->account->id));

        $this->assertFalse($this->account->refresh()->isCheckInconclusive());
        $this->assertTrue($this->account->isHeldForCheck());
        $this->assertSame($this->account->id, Account::findNextDueForCheck()?->id);
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new RecheckAccountCommand($this->account->id)),
            AccountRecheckRefused::class,
        );
    }

    private function again(string $requestKey): string
    {
        $this->journal->actAs('Owner');

        return $this->journal->run(new BeginSignInAgainCommand($this->account->id), $requestKey)
            ->attemptId;
    }

    private function cancel(string $attemptId): void
    {
        $this->journal->actAs('Owner');
        $this->app->make(CommandBus::class)->run(new CancelSignInCommand($attemptId));
    }

    private function asHost(Command $command): void
    {
        $this->app->make(JournalCommands::class)->runAsJournal(CommandEntry::HostControl, 'test host', $command);
    }
}
