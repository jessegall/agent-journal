<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\CleanAccount;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;

/**
 * Applies a host's cleanup proofs under the program's selection lock, then the account's, only in the generation the
 * cleanup was asked in; a failure keeps the cleanup pending for the next try.
 */
final readonly class CleanAccountHandler implements CommandHandler
{
    public function handle(CleanAccount $command): bool
    {
        ActiveAccount::lockedForJournal(Account::programForJournal($command->accountId));
        $account = Account::lockedForJournal($command->accountId);

        return $account->applyCleanup($command->generation, $command->progress);
    }
}
