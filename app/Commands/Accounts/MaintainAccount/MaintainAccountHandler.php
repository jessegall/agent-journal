<?php

declare(strict_types=1);

namespace App\Commands\Accounts\MaintainAccount;

use App\Contracts\Bus\CommandHandler;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;

/**
 * Sets the hold under the driver's selection lock and then the account's, the order every start takes.
 */
final readonly class MaintainAccountHandler implements CommandHandler
{
    public function handle(MaintainAccountCommand $command): void
    {
        ActiveAccount::findLockedFor(Account::resolveDriverOf($command->accountId));
        $account = Account::findLockedForChange($command->accountId);
        $account->holdForMaintenance();

    }
}
