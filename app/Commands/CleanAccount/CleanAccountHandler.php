<?php

declare(strict_types=1);

namespace App\Commands\CleanAccount;

use App\Contracts\Bus\CommandHandler;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Support\AccountUsagePurge;

/**
 * Applies a host's cleanup proofs under the driver's selection lock, then the account's, only in the generation the
 * cleanup was asked in; a failure keeps the cleanup pending for the next try, and a finished removal deletes the
 * account's usage readings.
 */
final readonly class CleanAccountHandler implements CommandHandler
{
    public function __construct(private AccountUsagePurge $usage) {}

    public function handle(CleanAccountCommand $command): bool
    {
        ActiveAccount::lockedForJournal(Account::driverForJournal($command->accountId));
        $account = Account::lockedForJournal($command->accountId);

        $isRemoved = $account->applyCleanup($command->generation, $command->progress);

        if ($isRemoved) {
            $this->usage->forgetAccount($account->id);
        }

        return $isRemoved;
    }
}
