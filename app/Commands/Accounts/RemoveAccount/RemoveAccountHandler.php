<?php

declare(strict_types=1);

namespace App\Commands\Accounts\RemoveAccount;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Enums\Accounts\SignInStatus;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use Carbon\CarbonImmutable;

/**
 * Starts the removal under the driver's selection lock, then the account's: a sign-in running on the account is
 * cancelled first, the account leaves the driver's choice without a replacement, and a new generation makes every
 * older callback out of date.
 */
final readonly class RemoveAccountHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(RemoveAccountCommand $command): void
    {
        $driver = Account::resolveDriverOf($command->accountId);
        $selection = ActiveAccount::findLockedFor($driver);
        $account = Account::findLockedForChange($command->accountId);

        if ($account->isBeingRemoved()) {
            return;
        }

        $liveAttempt = SignInAttempt::findLiveFor($driver, $account);

        if ($liveAttempt !== null) {
            $liveAttempt->finishAt(SignInStatus::Cancelled, CarbonImmutable::now());
        }

        $this->facts->runTransactionListeners();
        $account->refresh()->beginRemoval();
        $selection->clearIfChosen($account);
    }
}
