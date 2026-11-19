<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\RenameAccount;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Models\Account;
use App\Profiles\Values\AccountLabel;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class RenameAccountHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(RenameAccount $command): void
    {
        $label = AccountLabel::from($command->label);
        $account = Account::lockedForChange($command->accountId);
        $account->rename($label);

        $this->events->dispatch(new AccountsChanged($account->program, $account->id));
    }
}
