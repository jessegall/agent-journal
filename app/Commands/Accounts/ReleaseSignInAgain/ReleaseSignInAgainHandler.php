<?php

declare(strict_types=1);

namespace App\Commands\Accounts\ReleaseSignInAgain;

use App\Commands\Accounts\CancelAccountUses\CancelAccountUsesCommand;
use App\Commands\Accounts\HoldAccountUses\HoldAccountUsesCommand;
use App\Contracts\Accounts\AccountUses;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Support\RecordIdentity;

final readonly class ReleaseSignInAgainHandler implements CommandHandler
{
    public function __construct(
        private CommandBus $commands,
        private AccountUses $uses,
    ) {}

    public function handle(ReleaseSignInAgainCommand $command): bool
    {
        $attempt = SignInAttempt::lockedForJournal($command->attemptId);

        if (! $attempt->isLive() || ! $attempt->waits_for_uses || $attempt->account_id === null) {
            return false;
        }

        $account = new RecordIdentity(Account::LINK_TYPE, $attempt->account_id);
        $this->commands->run(new HoldAccountUsesCommand($account));
        $this->commands->run(new CancelAccountUsesCommand($account));

        if (! $this->uses->counts([$account])->isEmpty()) {
            return false;
        }

        $attempt->releaseForHost();

        return true;
    }
}
