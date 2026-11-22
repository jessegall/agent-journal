<?php

declare(strict_types=1);

namespace App\Commands\RetryAttemptCleanup;

use App\Contracts\CommandHandler;
use App\Models\SignInAttempt;

final readonly class RetryAttemptCleanupHandler implements CommandHandler
{
    public function handle(RetryAttemptCleanupCommand $command): void
    {
        $attempt = SignInAttempt::lockedForOwner($command->attemptId);
        $attempt->retryCleanup();
    }
}
