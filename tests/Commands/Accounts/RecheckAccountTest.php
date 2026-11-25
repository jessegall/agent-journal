<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\Accounts\CancelSignIn\CancelSignInCommand;
use App\Commands\Accounts\CheckAccount\CheckAccountCommand;
use App\Commands\Accounts\RecheckAccount\RecheckAccountCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Accounts\AccountCheckResult;
use App\Enums\Accounts\CommandEntry;
use App\Exceptions\AccountRecheckRefused;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\Command;
use App\Support\JournalCommands;
use App\Values\OwnerAuthority;
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
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

        User::factory()->create(['id' => TestIds::of(1)]);
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(1)));

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

        $this->actAsOwner();
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
        $this->actAsOwner();

        return $this->journal->run(new BeginSignInAgainCommand($this->account->id), $requestKey)
            ->attemptId;
    }

    private function cancel(string $attemptId): void
    {
        $this->actAsOwner();
        $this->app->make(CommandBus::class)->run(new CancelSignInCommand($attemptId));
    }

    private function asHost(Command $command): void
    {
        $this->app->make(JournalCommands::class)->runAsJournal(CommandEntry::HostControl, 'test host', $command);
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }
}
