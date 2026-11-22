<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\BeginSignInAgain\BeginSignInAgainCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Profiles\SignInAgainRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Starts signing a saved account in again once the owner confirmed it, and returns to the accounts page.
 */
final readonly class SignInAgainController
{
    public function __invoke(SignInAgainRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new BeginSignInAgainCommand($request->accountId()));

        return $redirect->back(303);
    }
}
