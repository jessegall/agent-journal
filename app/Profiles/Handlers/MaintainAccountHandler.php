<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\MaintainAccount;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Sets the hold under the program's selection lock and then the account's, the order every start takes.
 */
final readonly class MaintainAccountHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(MaintainAccount $command): void
    {
        ActiveAccount::lockedFor(Account::programOf($command->accountId));
        $account = Account::lockedForChange($command->accountId);
        $account->holdForMaintenance();

        $this->events->dispatch(new AccountsChanged($account->program, $account->id));
    }
}
