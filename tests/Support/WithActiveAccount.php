<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\CurrentActorSetter;
use App\Models\Accounts\Account;
use App\Support\ActorReference;

/**
 * For a test that starts agents through the real start path: saves a signed-in account for each driver and
 * chooses it, as the owner would on the Accounts page, so starts run with it.
 */
trait WithActiveAccount
{
    /**
     * Saves and chooses an account for every driver; the owner acts while it does, and a test sets its own actor
     * afterwards.
     *
     * @return array<string, Account>
     */
    protected function chooseActiveAccounts(): array
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );

        return $this->journal->chooseActiveAccounts()->chosenAccounts();
    }
}
