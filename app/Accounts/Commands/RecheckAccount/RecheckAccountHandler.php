<?php

declare(strict_types=1);

namespace App\Accounts\Commands\RecheckAccount;

use App\Bus\Contracts\CommandHandler;
use App\Models\Accounts\Account;

final readonly class RecheckAccountHandler implements CommandHandler
{
    public function handle(RecheckAccountCommand $command): void
    {
        Account::findLockedForChange($command->accountId)->recheck();
    }
}
