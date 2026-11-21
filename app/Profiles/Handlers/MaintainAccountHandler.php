<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\MaintainAccount;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;

/**
 * Sets the hold under the program's selection lock and then the account's, the order every start takes.
 */
final readonly class MaintainAccountHandler implements CommandHandler
{
    public function handle(MaintainAccount $command): void
    {
        ActiveAccount::lockedFor(Account::programOf($command->accountId));
        $account = Account::lockedForChange($command->accountId);
        $account->holdForMaintenance();

    }
}
