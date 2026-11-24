<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\Accounts\SubmitSignInCode\SubmitSignInCodeCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Profiles\SubmitSignInCodeRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Passes the code the owner typed to the running sign-in through the bus.
 */
final readonly class SubmitSignInCodeController
{
    public function __invoke(
        SubmitSignInCodeRequest $request,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new SubmitSignInCodeCommand($request->attemptId(), $request->code(), $request->submissionKey()));

        return $redirect->back(303);
    }
}
