<?php

declare(strict_types=1);

namespace App\Accounts\Commands\ExpireSignInAttempt;

use App\Accounts\Enums\SignInStatus;
use App\Accounts\SignInChallenges;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Models\Accounts\SignInAttempt;
use Carbon\CarbonImmutable;

final readonly class ExpireSignInAttemptHandler implements CommandHandler
{
    public function __construct(private SignInChallenges $challenges, private CommandFacts $facts) {}

    public function handle(ExpireSignInAttemptCommand $command): bool
    {
        $attempt = SignInAttempt::findLockedForJournal($command->attemptId);

        if (! $attempt->isLive() || ! $attempt->isExpiredAt(CarbonImmutable::now())) {
            return false;
        }

        $attempt->finishAt(SignInStatus::Expired, CarbonImmutable::now());
        $this->challenges->forget($attempt->id);
        $this->facts->runTransactionListeners();

        return true;
    }
}
