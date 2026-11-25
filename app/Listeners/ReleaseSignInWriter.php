<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Accounts\SignInAttemptFinished;
use App\Models\Accounts\Account;

/**
 * Lets go of the account folder a finished sign-in attempt wrote, in the attempt's own transaction, so a later attempt
 * may write it; an attempt that made no account releases nothing and looks nothing up.
 */
#[InCommandTransaction]
final readonly class ReleaseSignInWriter implements Listener
{
    public function handle(SignInAttemptFinished $finished): void
    {
        if ($finished->accountId === null) {
            return;
        }

        Account::lockedForJournal($finished->accountId)->endSignInAgain($finished->attemptId);
    }
}
