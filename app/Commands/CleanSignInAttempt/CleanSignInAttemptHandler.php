<?php

declare(strict_types=1);

namespace App\Commands\CleanSignInAttempt;

use App\Contracts\CommandHandler;
use App\Models\SignInAttempt;

final readonly class CleanSignInAttemptHandler implements CommandHandler
{
    public function handle(CleanSignInAttemptCommand $command): bool
    {
        return SignInAttempt::lockedForJournal($command->attemptId)->applyCleanup($command->progress);
    }
}
