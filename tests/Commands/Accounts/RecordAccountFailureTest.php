<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Access\Values\OwnerAuthority;
use App\Accounts\Commands\RecordAccountFailure\RecordAccountFailureCommand;
use App\Accounts\Values\AccountLabel;
use App\Actors\Contracts\CurrentActorSetter;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverFailure;
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
 * A driver failure is recorded on its account, and only a rejected sign-in seen in the current generation asks for a
 * check.
 */
#[TimeLimit(seconds: 4, reason: 'It commits account changes through the bus and empties five tables per test.')]
#[TestsCommand(RecordAccountFailureCommand::class)]
final class RecordAccountFailureTest extends TestCase
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

    public function test_only_a_rejected_sign_in_of_the_current_generation_asks_for_a_check(): void
    {
        $this->failWith(DriverFailure::RateLimit, 1);
        $this->failWith(DriverFailure::AuthenticationFailed, 0);
        $this->assertNull($this->account->refresh()->check_requested_generation);

        $this->failWith(DriverFailure::AuthenticationFailed, 1);

        $this->assertSame(1, $this->account->refresh()->check_requested_generation);
    }

    private function failWith(DriverFailure $failure, int $generation): void
    {
        event(new DriverFailed('agent', 'session', 'codex', $failure, $this->account->recordIdentity, $generation));
    }
}
