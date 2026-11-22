<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\RevokeProjectBinding\RevokeProjectBindingCommand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Inertia\ResponseFactory;

/**
 * Revokes a connected folder and its host through the bus, once; the window's page is shown again with the outcome
 * beside the folder, and a JSON caller gets the outcome and the time the server took the revocation.
 */
final readonly class RevokeProjectBindingController
{
    public function __invoke(
        string $binding,
        Request $request,
        CommandBus $commands,
        ResponseFactory $inertia,
        Redirector $redirect,
    ): JsonResponse|RedirectResponse {
        $outcome = $commands->run(new RevokeProjectBindingCommand($binding));

        if ($request->expectsJson()) {
            return new JsonResponse([
                'bindingId' => $outcome->id,
                'result' => $outcome->result,
                'revokedAt' => $outcome->revokedAt,
            ]);
        }

        $inertia->flash(RevokeProjectBindingsController::REVOKED_BINDINGS, [$outcome->id => $outcome->result]);

        return $redirect->back(303);
    }
}
