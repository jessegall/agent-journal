<?php

declare(strict_types=1);

namespace App\Profiles\Commands\ReleaseSignInAgain;

use App\Agents\Commands\CancelAccountUses\CancelAccountUsesCommand;
use App\Agents\Commands\HoldAccountUses\HoldAccountUsesCommand;
use App\Agents\Contracts\AccountUses;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Profiles\Models\Account;
use App\Profiles\Models\SignInAttempt;
use App\Records\Support\RecordIdentity;

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
