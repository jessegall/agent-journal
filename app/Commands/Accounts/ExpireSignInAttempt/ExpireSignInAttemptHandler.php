<?php

declare(strict_types=1);

namespace App\Commands\Accounts\ExpireSignInAttempt;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Enums\Accounts\SignInStatus;
use App\Models\Accounts\SignInAttempt;
use App\Support\SignInChallenges;
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
