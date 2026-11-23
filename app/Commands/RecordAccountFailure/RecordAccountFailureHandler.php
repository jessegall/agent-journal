<?php

declare(strict_types=1);

namespace App\Commands\RecordAccountFailure;

use App\Contracts\Bus\CommandHandler;
use App\Models\Accounts\Account;

final readonly class RecordAccountFailureHandler implements CommandHandler
{
    public function handle(RecordAccountFailureCommand $command): bool
    {
        return Account::lockedForJournal($command->accountId)->requestCheck($command->generation);
    }
}
