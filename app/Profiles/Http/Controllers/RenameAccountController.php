<?php

declare(strict_types=1);

namespace App\Profiles\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Profiles\RenameAccountRequest;
use App\Profiles\Commands\RenameAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Renames the account through the bus and returns to the Accounts page.
 */
final readonly class RenameAccountController
{
    public function __invoke(
        RenameAccountRequest $request,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new RenameAccount($request->accountId(), $request->label(), $request->seenRevision()));

        return $redirect->back(303);
    }
}
