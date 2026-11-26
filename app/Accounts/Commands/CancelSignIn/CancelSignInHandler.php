<?php

declare(strict_types=1);

namespace App\Accounts\Commands\CancelSignIn;

use App\Accounts\Enums\SignInStatus;
use App\Accounts\SignInChallenges;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Models\Accounts\SignInAttempt;
use Carbon\CarbonImmutable;

final readonly class CancelSignInHandler implements CommandHandler
{
    public function __construct(
        private SignInChallenges $challenges,
        private CommandFacts $facts,
    ) {}

    public function handle(CancelSignInCommand $command): void
    {
        $attempt = SignInAttempt::findLockedForOwner($command->attemptId);

        if (! $attempt->isLive()) {
            return;
        }

        $attempt->finishAt(SignInStatus::Cancelled, CarbonImmutable::now());
        $this->facts->runTransactionListeners();
        $this->challenges->forget($attempt->id);
    }
}
