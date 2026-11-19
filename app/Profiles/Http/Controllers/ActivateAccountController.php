<?php

declare(strict_types=1);

namespace App\Profiles\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Profiles\ActivateAccountRequest;
use App\Profiles\Commands\SwitchAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Chooses the account for new starts of its program through the bus and returns to the Accounts page.
 */
final readonly class ActivateAccountController
{
    public function __invoke(
        ActivateAccountRequest $request,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new SwitchAccount($request->accountId()));

        return $redirect->back(303);
    }
}
