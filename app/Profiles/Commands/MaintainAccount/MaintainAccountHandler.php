<?php

declare(strict_types=1);

namespace App\Profiles\Commands\MaintainAccount;

use App\Contracts\CommandHandler;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;

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
