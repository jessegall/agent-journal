<?php

declare(strict_types=1);

namespace App\Profiles\Commands\RecordAccountFailure;

use App\Contracts\CommandHandler;
use App\Profiles\Models\Account;

final readonly class RecordAccountFailureHandler implements CommandHandler
{
    public function handle(RecordAccountFailureCommand $command): bool
    {
        return Account::lockedForJournal($command->accountId)->requestCheck($command->generation);
    }
}
