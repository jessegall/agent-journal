<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\RevokeProjectBindings\RevokeProjectBindingsCommand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Inertia\ResponseFactory;

/**
 * Revokes the bindings the owner chose in the Connect a project window in one command, and shows the window again
 * with each binding's outcome.
 */
final readonly class RevokeProjectBindingsController
{
    /**
     * The flash key the window reads each chosen binding's outcome from.
     */
    public const string REVOKED_BINDINGS = 'revokedBindings';

    public function __invoke(
        Request $request,
        CommandBus $commands,
        ResponseFactory $inertia,
        Redirector $redirect,
    ): RedirectResponse {
        $request->validate(['bindings' => ['required', 'array', 'min:1', 'max:50'], 'bindings.*' => ['ulid']]);
        $bindingIds = array_values(array_map(strval(...), $request->array('bindings')));
        $revoked = $commands->run(new RevokeProjectBindingsCommand($bindingIds));
        $inertia->flash(self::REVOKED_BINDINGS, $revoked->outcomesByBindingId());

        return $redirect->back(303);
    }
}
