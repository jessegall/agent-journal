<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Accounts\Commands\CancelSignIn\CancelSignInCommand;
use App\Attributes\Web\RefreshesAppContext;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Cancels a sign-in through the bus and returns to the Accounts page.
 */
#[RefreshesAppContext]
final readonly class CancelSignInController
{
    #[Dispatches(CancelSignInCommand::class)]
    public function __invoke(string $attempt, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new CancelSignInCommand($attempt));

        return $redirect->back(303);
    }
}
