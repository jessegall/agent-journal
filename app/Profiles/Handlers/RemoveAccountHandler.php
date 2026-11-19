<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\RemoveAccount;
use App\Profiles\Enums\SignInState;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Starts the removal under the program's selection lock, then the account's: a sign-in running on the account is
 * cancelled first, the account leaves the program's choice without a replacement, and a new generation makes every
 * older callback out of date.
 */
final readonly class RemoveAccountHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(RemoveAccount $command): void
    {
        $program = Account::programOf($command->accountId);
        $selection = ActiveAccount::lockedFor($program);
        $account = Account::lockedForChange($command->accountId);

        if ($account->isBeingRemoved()) {
            return;
        }

        SignInAttempt::liveFor($program, $account)?->finish(SignInState::Cancelled);
        $account->refresh()->beginRemoval();
        $selection->clearIfChosen($account);
        $this->events->dispatch(new AccountsChanged($program->value, $account->id));
    }
}
