<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\CleanAccount;
use App\Profiles\Models\Account;
use App\Profiles\Models\AccountUsageCost;
use App\Profiles\Models\AccountUsageTokens;
use App\Profiles\Models\AccountUsageWindow;
use App\Profiles\Models\ActiveAccount;

/**
 * Applies a host's cleanup proofs under the program's selection lock, then the account's, only in the generation the
 * cleanup was asked in; a failure keeps the cleanup pending for the next try, and a finished removal deletes the
 * account's usage readings.
 */
final readonly class CleanAccountHandler implements CommandHandler
{
    public function handle(CleanAccount $command): bool
    {
        ActiveAccount::lockedForJournal(Account::driverForJournal($command->accountId));
        $account = Account::lockedForJournal($command->accountId);

        $isRemoved = $account->applyCleanup($command->generation, $command->progress);

        if ($isRemoved) {
            AccountUsageWindow::forgetAccount($account->id);
            AccountUsageCost::forgetAccount($account->id);
            AccountUsageTokens::forgetAccount($account->id);
        }

        return $isRemoved;
    }
}
