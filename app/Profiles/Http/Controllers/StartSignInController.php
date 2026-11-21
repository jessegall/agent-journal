<?php

declare(strict_types=1);

namespace App\Profiles\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Profiles\StartSignInRequest;
use App\Profiles\Commands\BeginSignIn;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Starts or rejoins a sign-in through the bus and returns to the Accounts page.
 */
final readonly class StartSignInController
{
    public function __invoke(
        StartSignInRequest $request,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new BeginSignIn(
            $request->driver(),
            $request->signInMethod(),
            $request->requestKey(),
        ));

        return $redirect->back(303);
    }
}
