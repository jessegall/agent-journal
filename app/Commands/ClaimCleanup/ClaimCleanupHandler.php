<?php

declare(strict_types=1);

namespace App\Commands\ClaimCleanup;

use App\Contracts\Bus\CommandHandler;
use App\Enums\CleanupTarget;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Values\ClaimedCleanup;

final readonly class ClaimCleanupHandler implements CommandHandler
{
    public function handle(ClaimCleanupCommand $command): ClaimedCleanup|null
    {
        $account = Account::nextToClean();

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

        $attempt = SignInAttempt::nextToClean();

        return $attempt === null ? null : new ClaimedCleanup(
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
