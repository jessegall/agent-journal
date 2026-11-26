<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Accounts\Commands\RenameAccount\RenameAccountCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Profiles\RenameAccountRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Renames the account through the bus and returns to the Accounts page.
 */
final readonly class RenameAccountController
{
    #[Dispatches(RenameAccountCommand::class)]
    public function __invoke(
        RenameAccountRequest $request,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new RenameAccountCommand($request->accountId(), $request->label(), $request->seenRevision()));

        return $redirect->back(303);
    }
}
