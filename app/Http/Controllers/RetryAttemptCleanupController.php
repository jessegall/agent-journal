<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Accounts\Commands\RetryAttemptCleanup\RetryAttemptCleanupCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Asks the host to try a cleanup again, and returns to the accounts page.
 */
final readonly class RetryAttemptCleanupController
{
    #[Dispatches(RetryAttemptCleanupCommand::class)]
    public function __invoke(string $attempt, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new RetryAttemptCleanupCommand($attempt));

        return $redirect->back(303);
    }
}
