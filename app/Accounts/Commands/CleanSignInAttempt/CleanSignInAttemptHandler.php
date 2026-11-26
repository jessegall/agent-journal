<?php

declare(strict_types=1);

namespace App\Accounts\Commands\CleanSignInAttempt;

use App\Bus\Contracts\CommandHandler;
use App\Models\Accounts\SignInAttempt;

final readonly class CleanSignInAttemptHandler implements CommandHandler
{
    public function handle(CleanSignInAttemptCommand $command): bool
    {
        return SignInAttempt::findLockedForJournal($command->attemptId)->applyCleanup($command->progress);
    }
}
