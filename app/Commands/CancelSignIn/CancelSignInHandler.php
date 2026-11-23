<?php

declare(strict_types=1);

namespace App\Commands\CancelSignIn;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Enums\SignInState;
use App\Models\Accounts\SignInAttempt;
use App\Support\SignInChallenges;
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
        $this->facts->runTransactionListeners();
        $this->challenges->forget($attempt->id);
    }
}
