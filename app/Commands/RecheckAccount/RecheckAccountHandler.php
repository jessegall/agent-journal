<?php

declare(strict_types=1);

namespace App\Commands\RecheckAccount;

use App\Contracts\Bus\CommandHandler;
use App\Models\Account;

final readonly class RecheckAccountHandler implements CommandHandler
{
    public function handle(RecheckAccountCommand $command): void
    {
        Account::lockedForChange($command->accountId)->recheck();
    }
}
