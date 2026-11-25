<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Profiles\StartSignInRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Starts or rejoins a sign-in through the bus and returns to the Accounts page.
 */
final readonly class StartSignInController
{
    #[Dispatches(BeginSignInCommand::class)]
    public function __invoke(
        StartSignInRequest $request,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new BeginSignInCommand(
            $request->driver(),
            $request->signInMethod(),
        ));

        return $redirect->back(303);
    }
}
