<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\CleanSignInAttempt;
use App\Profiles\Models\SignInAttempt;

final readonly class CleanSignInAttemptHandler implements CommandHandler
{
    public function handle(CleanSignInAttempt $command): bool
    {
        return SignInAttempt::lockedForJournal($command->attemptId)->applyCleanup($command->progress);
    }
}
