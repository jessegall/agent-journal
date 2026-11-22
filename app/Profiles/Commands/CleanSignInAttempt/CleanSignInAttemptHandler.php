<?php

declare(strict_types=1);

namespace App\Profiles\Commands\CleanSignInAttempt;

use App\Contracts\CommandHandler;
use App\Profiles\Models\SignInAttempt;

final readonly class CleanSignInAttemptHandler implements CommandHandler
{
    public function handle(CleanSignInAttemptCommand $command): bool
    {
        return SignInAttempt::lockedForJournal($command->attemptId)->applyCleanup($command->progress);
    }
}
