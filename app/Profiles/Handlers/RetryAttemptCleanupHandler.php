<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\RetryAttemptCleanup;
use App\Profiles\Models\SignInAttempt;

final readonly class RetryAttemptCleanupHandler implements CommandHandler
{
    public function handle(RetryAttemptCleanup $command): void
    {
        $attempt = SignInAttempt::lockedForOwner($command->attemptId);
        $attempt->retryCleanup();
    }
}
