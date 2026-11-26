<?php

declare(strict_types=1);

namespace App\Accounts\Commands\RetryAttemptCleanup;

use App\Bus\Contracts\CommandHandler;
use App\Models\Accounts\SignInAttempt;

final readonly class RetryAttemptCleanupHandler implements CommandHandler
{
    public function handle(RetryAttemptCleanupCommand $command): void
    {
        $attempt = SignInAttempt::findLockedForOwner($command->attemptId);
        $attempt->retryCleanup();
    }
}
