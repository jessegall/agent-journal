<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\RetryAccountCleanup;
use App\Profiles\Models\Account;

final readonly class RetryAccountCleanupHandler implements CommandHandler
{
    public function handle(RetryAccountCleanup $command): void
    {
        $account = Account::lockedForChange($command->accountId);
        $account->retryCleanup();
    }
}
