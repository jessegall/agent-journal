<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\CleanAccount;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Applies a host's cleanup proofs under the program's selection lock, then the account's, only in the generation the
 * cleanup was asked in; a failure keeps the cleanup pending for the next try.
 */
final readonly class CleanAccountHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(CleanAccount $command): bool
    {
        ActiveAccount::lockedForJournal(Account::programForJournal($command->accountId));
        $account = Account::lockedForJournal($command->accountId);

        if (! $account->applyCleanup($command->generation, $command->progress)) {
            return false;
        }

        $this->events->dispatch(new AccountsChanged($account->program, $account->id));

        return true;
    }
}
