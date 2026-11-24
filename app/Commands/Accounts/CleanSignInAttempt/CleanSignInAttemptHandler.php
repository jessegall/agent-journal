<?php

declare(strict_types=1);

namespace App\Commands\Accounts\CleanSignInAttempt;

use App\Contracts\Bus\CommandHandler;
use App\Models\Accounts\SignInAttempt;

final readonly class CleanSignInAttemptHandler implements CommandHandler
{
    public function handle(CleanSignInAttemptCommand $command): bool
    {
        return SignInAttempt::lockedForJournal($command->attemptId)->applyCleanup($command->progress);
    }
}
