<?php

declare(strict_types=1);

namespace App\Profiles\Commands\RetryAttemptCleanup;

use App\Contracts\CommandHandler;
use App\Profiles\Models\SignInAttempt;

final readonly class RetryAttemptCleanupHandler implements CommandHandler
{
    public function handle(RetryAttemptCleanupCommand $command): void
    {
        $attempt = SignInAttempt::lockedForOwner($command->attemptId);
        $attempt->retryCleanup();
    }
}
