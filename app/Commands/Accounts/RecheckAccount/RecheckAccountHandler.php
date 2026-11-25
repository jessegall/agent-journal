<?php

declare(strict_types=1);

namespace App\Commands\Accounts\RecheckAccount;

use App\Contracts\Bus\CommandHandler;
use App\Models\Accounts\Account;

final readonly class RecheckAccountHandler implements CommandHandler
{
    public function handle(RecheckAccountCommand $command): void
    {
        Account::findLockedForChange($command->accountId)->recheck();
    }
}
