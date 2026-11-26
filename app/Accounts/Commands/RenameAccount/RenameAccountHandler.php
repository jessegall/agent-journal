<?php

declare(strict_types=1);

namespace App\Accounts\Commands\RenameAccount;

use App\Accounts\Values\AccountLabel;
use App\Bus\Contracts\CommandHandler;
use App\Models\Accounts\Account;

final readonly class RenameAccountHandler implements CommandHandler
{
    public function handle(RenameAccountCommand $command): void
    {
        $label = AccountLabel::from($command->label);
        $account = Account::findLockedForChange($command->accountId);
        $account->rename($label, $command->seenRevision);

    }
}
