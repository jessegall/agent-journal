<?php

declare(strict_types=1);

namespace App\Accounts\Commands\ReleaseAccountRemoval;

use App\Accounts\Commands\CancelAccountUses\CancelAccountUsesCommand;
use App\Accounts\Commands\HoldAccountUses\HoldAccountUsesCommand;
use App\Accounts\Contracts\AccountUses;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\Models\Accounts\Account;

final readonly class ReleaseAccountRemovalHandler implements CommandHandler
{
    public function __construct(
        private CommandBus $commands,
        private AccountUses $uses,
    ) {}

    public function handle(ReleaseAccountRemovalCommand $command): bool
    {
        $account = Account::findLockedForJournal($command->accountId);

        if (! $account->cleanup_pending || $account->cleanup_released) {
            return false;
        }

        $identity = $account->recordIdentity;
        $this->commands->run(new HoldAccountUsesCommand($identity));
        $this->commands->run(new CancelAccountUsesCommand($identity));

        if (! $this->uses->counts([$identity])->isEmpty()) {
            return false;
        }

        $account->releaseCleanup();

        return true;
    }
}
