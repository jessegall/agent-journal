<?php

declare(strict_types=1);

namespace App\Accounts\Commands\CleanAccount;

use App\Accounts\AccountUsagePurge;
use App\Bus\Contracts\CommandHandler;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;

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
        ActiveAccount::findLockedForJournal(Account::resolveDriverForJournal($command->accountId));
        $account = Account::findLockedForJournal($command->accountId);

        $isRemoved = $account->applyCleanup($command->generation, $command->progress);

        if ($isRemoved) {
            $this->usage->forgetAccount($account->id);
        }

        return $isRemoved;
    }
}
