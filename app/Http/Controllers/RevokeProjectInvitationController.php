<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Projects\Commands\RevokeProjectInvitation\RevokeProjectInvitationCommand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Redirector;

/**
 * Cancels an install attempt by revoking its pending line through the bus, at the attempt version the window saw;
 * the window's page is shown again, a JSON caller gets no content.
 */
final readonly class RevokeProjectInvitationController
{
    #[Dispatches(RevokeProjectInvitationCommand::class)]
    public function __invoke(
        string $invitation,
        Request $request,
        CommandBus $commands,
        Redirector $redirect,
    ): Response|RedirectResponse {
        $seenVersion = $request->filled('seenVersion') ? $request->integer('seenVersion') : null;
        $commands->run(new RevokeProjectInvitationCommand($invitation, $seenVersion));

        if ($request->expectsJson()) {
            return new Response(status: Response::HTTP_NO_CONTENT);
        }

        return $redirect->back(303);
    }
}
