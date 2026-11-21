<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Connections\Support\InstallLine;
use App\Connections\Values\InstallTicket;
use App\Http\Requests\Connections\IssueProjectInvitationRequest;
use Illuminate\Http\JsonResponse;

/**
 * Issues an install line through the bus and answers it once. The ticket is made here, so the command, its receipt
 * and every log hold only its digest; the answer is never cached.
 */
final readonly class IssueProjectInvitationController
{
    public function __invoke(
        IssueProjectInvitationRequest $request,
        CommandBus $commands,
        InstallLine $line,
    ): JsonResponse {
        $ticket = InstallTicket::generate();
        $issued = $commands->run($request->commandFor($ticket));

        return new JsonResponse([
            'installLine' => $line->for($ticket),
            'expiresAt' => $issued->expiresAt,
            'invitationId' => $issued->invitationId,
        ], JsonResponse::HTTP_CREATED, ['Cache-Control' => 'no-store, private']);
    }
}
