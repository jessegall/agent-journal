<?php

declare(strict_types=1);

namespace App\Profiles\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\RetryAccountCleanup\RetryAccountCleanupCommand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Asks the host to try a cleanup again, and returns to the accounts page.
 */
final readonly class RetryAccountCleanupController
{
    public function __invoke(string $account, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new RetryAccountCleanupCommand($account));

        return $redirect->back(303);
    }
}
