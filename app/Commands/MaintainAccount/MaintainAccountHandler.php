<?php

declare(strict_types=1);

namespace App\Commands\MaintainAccount;

use App\Contracts\Bus\CommandHandler;
use App\Models\Account;
use App\Models\ActiveAccount;

/**
 * Sets the hold under the driver's selection lock and then the account's, the order every start takes.
 */
final readonly class MaintainAccountHandler implements CommandHandler
{
    public function handle(MaintainAccountCommand $command): void
    {
        ActiveAccount::lockedFor(Account::driverOf($command->accountId));
        $account = Account::lockedForChange($command->accountId);
        $account->holdForMaintenance();

    }
}
