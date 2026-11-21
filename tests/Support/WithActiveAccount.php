<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Drivers\Enums\HookDriver;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Values\AccountLabel;

/**
 * For a test that starts agents through the real start path: saves a signed-in account for each program and
 * chooses it, as the owner would on the Accounts page, so starts run with it.
 */
trait WithActiveAccount
{
    /**
     * Saves and chooses an account for every program; the owner acts while it does, and a test sets its own actor
     * afterwards.
     *
     * @return array<string, Account>
     */
    protected function chooseActiveAccounts(): array
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $chosen = [];

        foreach (HookDriver::cases() as $driver) {
            $directory = "/journal/accounts/{$driver->value}";
            $account = Account::create($driver, AccountLabel::from('Test account'), $directory);
            ActiveAccount::lockedFor($driver)->select($account);
            $chosen[$driver->value] = $account;
        }

        return $chosen;
    }
}
