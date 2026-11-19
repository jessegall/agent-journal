<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Agents\Commands\CancelAccountUses;
use App\Agents\Commands\HoldAccountUses;
use App\Agents\Contracts\AccountUses;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\ReleaseSignInAgain;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Models\Account;
use App\Profiles\Models\SignInAttempt;
use App\Records\Support\RecordIdentity;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class ReleaseSignInAgainHandler implements CommandHandler
{
    public function __construct(
        private CommandBus $commands,
        private AccountUses $uses,
        private Dispatcher $events,
    ) {}

    public function handle(ReleaseSignInAgain $command): bool
    {
        $attempt = SignInAttempt::lockedForJournal($command->attemptId);

        if (! $attempt->isLive() || ! $attempt->waits_for_uses || $attempt->account_id === null) {
            return false;
        }

        $account = new RecordIdentity(Account::LINK_TYPE, $attempt->account_id);
        $this->commands->run(new HoldAccountUses($account));
        $this->commands->run(new CancelAccountUses($account));

        if (! $this->uses->counts([$account])->isEmpty()) {
            return false;
        }

        $attempt->releaseForHost();
        $this->events->dispatch(new AccountsChanged($attempt->program, $attempt->account_id));

        return true;
    }
}
