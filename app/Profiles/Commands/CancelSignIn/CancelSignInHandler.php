<?php

declare(strict_types=1);

namespace App\Profiles\Commands\CancelSignIn;

use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Profiles\Enums\SignInState;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInChallenges;
use Carbon\CarbonImmutable;

final readonly class CancelSignInHandler implements CommandHandler
{
    public function __construct(
        private SignInChallenges $challenges,
        private CommandFacts $facts,
    ) {}

    public function handle(CancelSignInCommand $command): void
    {
        $attempt = SignInAttempt::lockedForOwner($command->attemptId);

        if (! $attempt->isLive()) {
            return;
        }

        $attempt->finishAt(SignInState::Cancelled, CarbonImmutable::now());
        $this->facts->applyRequired();
        $this->challenges->forget($attempt->id);
    }
}
