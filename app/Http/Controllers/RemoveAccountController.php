<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Accounts\Commands\RemoveAccount\RemoveAccountCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Removes a saved account once the owner confirmed it, and returns to the accounts page.
 */
final readonly class RemoveAccountController
{
    #[Dispatches(RemoveAccountCommand::class)]
    public function __invoke(string $account, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new RemoveAccountCommand($account));

        return $redirect->back(303);
    }
}
