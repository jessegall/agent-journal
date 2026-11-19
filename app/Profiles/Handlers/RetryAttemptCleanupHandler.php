<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\RetryAttemptCleanup;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Models\SignInAttempt;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class RetryAttemptCleanupHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(RetryAttemptCleanup $command): void
    {
        $attempt = SignInAttempt::lockedForOwner($command->attemptId);
        $attempt->retryCleanup();
        $this->events->dispatch(new AccountsChanged($attempt->program, $attempt->id));
    }
}
