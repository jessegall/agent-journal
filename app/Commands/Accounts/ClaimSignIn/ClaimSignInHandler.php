<?php

declare(strict_types=1);

namespace App\Commands\Accounts\ClaimSignIn;

use App\Contracts\Bus\CommandHandler;
use App\Models\Accounts\SignInAttempt;
use App\Values\ClaimedSignIn;
use Carbon\CarbonImmutable;

final readonly class ClaimSignInHandler implements CommandHandler
{
    public function handle(ClaimSignInCommand $command): ClaimedSignIn|null
    {
        $attempt = SignInAttempt::findOldestWaitingAt(CarbonImmutable::now());

        if ($attempt === null) {
            return null;
        }

        $attempt->claimOn($command->hostId);

        return new ClaimedSignIn(
            $attempt->id,
            $attempt->account_protocol,
            $attempt->method,
            (string) $attempt->directory,
            $attempt->generation,
            $attempt->expires_at->toIso8601String(),
            $attempt->account_id,
        );
    }
}
