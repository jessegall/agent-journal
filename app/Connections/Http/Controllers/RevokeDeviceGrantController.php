<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\RevokeDeviceGrant\RevokeDeviceGrantCommand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Redirector;

/**
 * The owner revokes one terminal sign-in; the window's page is shown again, a JSON caller gets no content. The binding,
 * its host and every other sign-in keep working.
 */
final readonly class RevokeDeviceGrantController
{
    public function __invoke(
        string $grant,
        Request $request,
        CommandBus $commands,
        Redirector $redirect,
    ): Response|RedirectResponse {
        $commands->run(new RevokeDeviceGrantCommand($grant));

        return $request->expectsJson() ? new Response(status: Response::HTTP_NO_CONTENT) : $redirect->back(303);
    }
}
