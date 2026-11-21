<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\RecheckAccount;
use App\Profiles\Models\Account;

final readonly class RecheckAccountHandler implements CommandHandler
{
    public function handle(RecheckAccount $command): void
    {
        Account::lockedForChange($command->accountId)->recheck();
    }
}
