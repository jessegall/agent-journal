<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Access\Values\OwnerAuthority;
use App\Accounts\Commands\ClaimAccountCheck\ClaimAccountCheckCommand;
use App\Accounts\Enums\CommandEntry;
use App\Accounts\Values\AccountLabel;
use App\Accounts\Values\ClaimedAccountCheck;
use App\Actors\Contracts\CurrentActorSetter;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverFailure;
use App\Bus\Contracts\JournalCommands;
use App\Events\Sessions\DriverFailed;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Support\ActorReference;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A host claims the next account that asks for a check, and nothing while no account asks.
 */
#[TimeLimit(seconds: 4, reason: 'It commits account changes through the bus and empties five tables per test.')]
#[TestsCommand(ClaimAccountCheckCommand::class)]
final class ClaimAccountCheckTest extends TestCase
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
            ActorReference::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $this->account = Account::create(DefaultDrivers::CODEX, AccountLabel::from('Work'), '/journal/accounts/work');
        ActiveAccount::findLockedFor(DefaultDrivers::CODEX)->select($this->account);
    }

    public function test_an_account_asking_for_a_check_is_claimed_and_none_is_claimed_before(): void
    {
        $claim = fn () => $this->app->make(JournalCommands::class)
            ->runAsJournal(CommandEntry::HostControl, 'test host', new ClaimAccountCheckCommand('host'));
        $this->assertNull($claim());

        $this->failWith(DriverFailure::AuthenticationFailed, 1);
        $claimed = $claim();

        $this->assertInstanceOf(ClaimedAccountCheck::class, $claimed);
        $this->assertSame($this->account->id, $claimed->accountId);
    }

    private function failWith(DriverFailure $failure, int $generation): void
    {
        event(new DriverFailed('agent', 'session', 'codex', $failure, $this->account->recordIdentity, $generation));
    }
}
