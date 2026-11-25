<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Commands\Accounts\RemoveAccount\RemoveAccountCommand;
use App\Contracts\Bus\CommandBus;
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
