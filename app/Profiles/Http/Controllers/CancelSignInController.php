<?php

declare(strict_types=1);

namespace App\Profiles\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\CancelSignIn;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Cancels a sign-in through the bus and returns to the Accounts page.
 */
final readonly class CancelSignInController
{
    public function __invoke(string $attempt, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new CancelSignIn($attempt));

        return $redirect->back(303);
    }
}
