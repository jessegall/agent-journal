<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\ClaimSignIn;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Values\ClaimedSignIn;
use Carbon\CarbonImmutable;

final readonly class ClaimSignInHandler implements CommandHandler
{
    public function handle(ClaimSignIn $command): ClaimedSignIn|null
    {
        $attempt = SignInAttempt::claimFor($command->hostId, CarbonImmutable::now());

        if ($attempt === null) {
            return null;
        }

        return new ClaimedSignIn(
            $attempt->id,
            $attempt->program,
            $attempt->method,
            (string) $attempt->directory,
            $attempt->generation,
            $attempt->expires_at->toIso8601String(),
        );
    }
}
