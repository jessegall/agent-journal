<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\RemoveAccount;
use App\Profiles\Enums\SignInState;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;

/**
 * Starts the removal under the program's selection lock, then the account's: a sign-in running on the account is
 * cancelled first, the account leaves the program's choice without a replacement, and a new generation makes every
 * older callback out of date.
 */
final readonly class RemoveAccountHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(RemoveAccount $command): void
    {
        $driver = Account::driverOf($command->accountId);
        $selection = ActiveAccount::lockedFor($driver);
        $account = Account::lockedForChange($command->accountId);

        if ($account->isBeingRemoved()) {
            return;
        }

        SignInAttempt::liveFor($driver, $account)?->finish(SignInState::Cancelled);
        $this->facts->applyRequired();
        $account->refresh()->beginRemoval();
        $selection->clearIfChosen($account);
    }
}
