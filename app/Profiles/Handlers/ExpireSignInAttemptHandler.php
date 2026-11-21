<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\ExpireSignInAttempt;
use App\Profiles\Enums\SignInState;
use App\Profiles\Models\SignInAttempt;
use Carbon\CarbonImmutable;

final readonly class ExpireSignInAttemptHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(ExpireSignInAttempt $command): bool
    {
        $attempt = SignInAttempt::lockedForJournal($command->attemptId);

        if (! $attempt->isLive() || ! $attempt->isExpiredAt(CarbonImmutable::now())) {
            return false;
        }

        $attempt->finish(SignInState::Expired);
        $this->facts->applyRequired();

        return true;
    }
}
