<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\RevokeProjectBinding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Redirector;

/**
 * Revokes a connected folder and its host through the bus; the window's page is shown again, a JSON caller gets no
 * content.
 */
final readonly class RevokeProjectBindingController
{
    public function __invoke(
        string $binding,
        Request $request,
        CommandBus $commands,
        Redirector $redirect,
    ): Response|RedirectResponse {
        $commands->run(new RevokeProjectBinding($binding));

        return $request->expectsJson() ? new Response(status: Response::HTTP_NO_CONTENT) : $redirect->back(303);
    }
}
