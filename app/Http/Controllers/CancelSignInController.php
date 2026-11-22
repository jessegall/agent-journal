<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\CancelSignIn\CancelSignInCommand;
use App\Contracts\Bus\CommandBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Cancels a sign-in through the bus and returns to the Accounts page.
 */
final readonly class CancelSignInController
{
    public function __invoke(string $attempt, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new CancelSignInCommand($attempt));

        return $redirect->back(303);
    }
}
