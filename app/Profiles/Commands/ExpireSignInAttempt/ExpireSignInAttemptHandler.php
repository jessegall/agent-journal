<?php

declare(strict_types=1);

namespace App\Profiles\Commands\ExpireSignInAttempt;

use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Profiles\Enums\SignInState;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInChallenges;
use Carbon\CarbonImmutable;

final readonly class ExpireSignInAttemptHandler implements CommandHandler
{
    public function __construct(private SignInChallenges $challenges, private CommandFacts $facts) {}

    public function handle(ExpireSignInAttemptCommand $command): bool
    {
        $attempt = SignInAttempt::lockedForJournal($command->attemptId);

        if (! $attempt->isLive() || ! $attempt->isExpiredAt(CarbonImmutable::now())) {
            return false;
        }

        $attempt->finishAt(SignInState::Expired, CarbonImmutable::now());
        $this->challenges->forget($attempt->id);
        $this->facts->applyRequired();

        return true;
    }
}
