<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Agents\Commands\CancelAccountUses;
use App\Agents\Commands\HoldAccountUses;
use App\Agents\Contracts\AccountUses;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\ReleaseAccountRemoval;
use App\Profiles\Models\Account;

final readonly class ReleaseAccountRemovalHandler implements CommandHandler
{
    public function __construct(
        private CommandBus $commands,
        private AccountUses $uses,
    ) {}

    public function handle(ReleaseAccountRemoval $command): bool
    {
        $account = Account::lockedForJournal($command->accountId);

        if (! $account->cleanup_pending || $account->cleanup_released) {
            return false;
        }

        $identity = $account->recordIdentity();
        $this->commands->run(new HoldAccountUses($identity));
        $this->commands->run(new CancelAccountUses($identity));

        if (! $this->uses->counts([$identity])->isEmpty()) {
            return false;
        }

        $account->releaseCleanup();

        return true;
    }
}
