<?php

declare(strict_types=1);

namespace App\Profiles\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\RemoveAccount\RemoveAccountCommand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Removes a saved account once the owner confirmed it, and returns to the accounts page.
 */
final readonly class RemoveAccountController
{
    public function __invoke(string $account, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new RemoveAccountCommand($account));

        return $redirect->back(303);
    }
}
