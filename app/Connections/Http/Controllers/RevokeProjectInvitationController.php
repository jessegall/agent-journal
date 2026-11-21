<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\RevokeProjectInvitation;
use Illuminate\Http\Response;

/**
 * Revokes a pending install line through the bus.
 */
final readonly class RevokeProjectInvitationController
{
    public function __invoke(string $invitation, CommandBus $commands): Response
    {
        $commands->run(new RevokeProjectInvitation($invitation));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
