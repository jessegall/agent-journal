<?php

declare(strict_types=1);

namespace App\Commands\ReleaseAccountRemoval;

use App\Commands\CancelAccountUses\CancelAccountUsesCommand;
use App\Commands\HoldAccountUses\HoldAccountUsesCommand;
use App\Contracts\AccountUses;
use App\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Models\Account;

final readonly class ReleaseAccountRemovalHandler implements CommandHandler
{
    public function __construct(
        private CommandBus $commands,
        private AccountUses $uses,
    ) {}

    public function handle(ReleaseAccountRemovalCommand $command): bool
    {
        $account = Account::lockedForJournal($command->accountId);

        if (! $account->cleanup_pending || $account->cleanup_released) {
            return false;
        }

        $identity = $account->recordIdentity();
        $this->commands->run(new HoldAccountUsesCommand($identity));
        $this->commands->run(new CancelAccountUsesCommand($identity));

        if (! $this->uses->counts([$identity])->isEmpty()) {
            return false;
        }

        $account->releaseCleanup();

        return true;
    }
}
