<?php

declare(strict_types=1);

namespace App\Commands\RenameAccount;

use App\Contracts\Bus\CommandHandler;
use App\Models\Accounts\Account;
use App\Values\AccountLabel;

final readonly class RenameAccountHandler implements CommandHandler
{
    public function handle(RenameAccountCommand $command): void
    {
        $label = AccountLabel::from($command->label);
        $account = Account::lockedForChange($command->accountId);
        $account->rename($label, $command->seenRevision);

    }
}
