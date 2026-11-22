<?php

declare(strict_types=1);

namespace App\Profiles\Commands\RetryAccountCleanup;

use App\Contracts\CommandHandler;
use App\Profiles\Models\Account;

final readonly class RetryAccountCleanupHandler implements CommandHandler
{
    public function handle(RetryAccountCleanupCommand $command): void
    {
        $account = Account::lockedForChange($command->accountId);
        $account->retryCleanup();
    }
}
