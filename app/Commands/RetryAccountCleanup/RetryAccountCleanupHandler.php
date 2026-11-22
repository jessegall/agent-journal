<?php

declare(strict_types=1);

namespace App\Commands\RetryAccountCleanup;

use App\Contracts\Bus\CommandHandler;
use App\Models\Account;

final readonly class RetryAccountCleanupHandler implements CommandHandler
{
    public function handle(RetryAccountCleanupCommand $command): void
    {
        $account = Account::lockedForChange($command->accountId);
        $account->retryCleanup();
    }
}
