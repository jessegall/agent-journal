<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Accounts\Commands\BeginSignInAgain\BeginSignInAgainCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Profiles\SignInAgainRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Starts signing a saved account in again once the owner confirmed it, and returns to the accounts page.
 */
final readonly class SignInAgainController
{
    #[Dispatches(BeginSignInAgainCommand::class)]
    public function __invoke(SignInAgainRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new BeginSignInAgainCommand($request->accountId()));

        return $redirect->back(303);
    }
}
