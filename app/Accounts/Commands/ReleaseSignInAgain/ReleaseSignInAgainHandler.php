<?php

declare(strict_types=1);

namespace App\Accounts\Commands\ReleaseSignInAgain;

use App\Accounts\Commands\CancelAccountUses\CancelAccountUsesCommand;
use App\Accounts\Commands\HoldAccountUses\HoldAccountUsesCommand;
use App\Accounts\Contracts\AccountUses;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
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
        $attempt = SignInAttempt::findLockedForJournal($command->attemptId);

        if (! $attempt->isLive() || ! $attempt->waits_for_uses || $attempt->account_id === null) {
            return false;
        }

        $account = new RecordIdentity(Account::linkType(), $attempt->account_id);
        $this->commands->run(new HoldAccountUsesCommand($account));
        $this->commands->run(new CancelAccountUsesCommand($account));

        if (! $this->uses->counts([$account])->isEmpty()) {
            return false;
        }

        $attempt->releaseForHost();

        return true;
    }
}
