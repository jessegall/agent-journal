<?php

declare(strict_types=1);

namespace App\Accounts\Commands\RetryAccountCleanup;

use App\Bus\Contracts\CommandHandler;
use App\Models\Accounts\Account;

final readonly class RetryAccountCleanupHandler implements CommandHandler
{
    public function handle(RetryAccountCleanupCommand $command): void
    {
        $account = Account::findLockedForChange($command->accountId);
        $account->retryCleanup();
    }
}
