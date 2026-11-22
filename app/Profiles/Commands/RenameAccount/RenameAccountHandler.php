<?php

declare(strict_types=1);

namespace App\Profiles\Commands\RenameAccount;

use App\Contracts\CommandHandler;
use App\Profiles\Models\Account;
use App\Profiles\Values\AccountLabel;

final readonly class RenameAccountHandler implements CommandHandler
{
    public function handle(RenameAccountCommand $command): void
    {
        $label = AccountLabel::from($command->label);
        $account = Account::lockedForChange($command->accountId);
        $account->rename($label, $command->seenRevision);

    }
}
