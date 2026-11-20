<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\ClaimCleanup;
use App\Profiles\Enums\CleanupTarget;
use App\Profiles\Models\Account;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Values\ClaimedCleanup;

final readonly class ClaimCleanupHandler implements CommandHandler
{
    public function handle(ClaimCleanup $command): ClaimedCleanup|null
    {
        $account = Account::nextToClean();

        if ($account !== null) {
            return new ClaimedCleanup(
                CleanupTarget::Account,
                $account->id,
                $account->program,
                $account->method,
                (string) $account->directory,
                $account->sign_in_generation,
                $account->store_removed,
            );
        }

        $attempt = SignInAttempt::nextToClean();

        return $attempt === null ? null : new ClaimedCleanup(
            CleanupTarget::SignInAttempt,
            $attempt->id,
            $attempt->program,
            $attempt->method,
            (string) $attempt->directory,
            $attempt->generation,
            $attempt->store_removed,
        );
    }
}
