<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\RecheckAccount\RecheckAccountCommand;
use App\Contracts\CommandBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Asks the host to check a held account again, and returns to the accounts page.
 */
final readonly class RecheckAccountController
{
    public function __invoke(string $account, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new RecheckAccountCommand($account));

        return $redirect->back(303);
    }
}
