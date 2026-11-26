<?php

declare(strict_types=1);

namespace App\Accounts\Commands\ClaimCleanup;

use App\Accounts\Enums\CleanupTarget;
use App\Accounts\Values\ClaimedCleanup;
use App\Bus\Contracts\CommandHandler;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;

final readonly class ClaimCleanupHandler implements CommandHandler
{
    public function handle(ClaimCleanupCommand $command): ClaimedCleanup|null
    {
        $account = Account::findNextDueForCleanup();

        if ($account !== null) {
            return new ClaimedCleanup(
                CleanupTarget::Account,
                $account->id,
                $account->account_protocol,
                $account->method,
                (string) $account->directory,
                $account->sign_in_generation,
                $account->store_removed,
                $account->id,
            );
        }

        $attempt = SignInAttempt::findNextDueForCleanup();

        if ($attempt === null) {
            return null;
        }

        return new ClaimedCleanup(
            CleanupTarget::SignInAttempt,
            $attempt->id,
            $attempt->account_protocol,
            $attempt->method,
            (string) $attempt->directory,
            $attempt->generation,
            $attempt->store_removed,
            $attempt->account_id,
        );
    }
}
