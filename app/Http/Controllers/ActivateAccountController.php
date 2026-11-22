<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\SwitchAccount\SwitchAccountCommand;
use App\Contracts\CommandBus;
use App\Http\Requests\Profiles\ActivateAccountRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Chooses the account for new starts of its driver through the bus and returns to the Accounts page.
 */
final readonly class ActivateAccountController
{
    public function __invoke(
        ActivateAccountRequest $request,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new SwitchAccountCommand($request->accountId(), $request->expectedChangeNumber()));

        return $redirect->back(303);
    }
}
