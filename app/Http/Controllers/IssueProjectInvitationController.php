<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\CommandBus;
use App\Http\Requests\Connections\IssueProjectInvitationRequest;
use App\Http\Responses\PageActionAnswers;
use App\Support\InstallLine;
use App\Values\InstallTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

/**
 * Issues an install line through the bus and answers it once. The ticket is made here, so the command, its receipt
 * and every log hold only its digest. The window's form gets it as a one-time flash beside the page, never in the
 * page's props or history; a JSON caller reads it from an answer that is never cached.
 */
final readonly class IssueProjectInvitationController
{
    /**
     * The flash key the window reads the issued line, its expiry, its invitation and its install attempt from.
     */
    public const string ISSUED_LINE = 'issuedLine';

    public function __invoke(
        IssueProjectInvitationRequest $request,
        CommandBus $commands,
        InstallLine $line,
        PageActionAnswers $answers,
    ): JsonResponse|RedirectResponse {
        $ticket = InstallTicket::generate();
        $issued = $commands->run($request->commandFor($ticket));

        $answer = [
            'installLine' => $line->for($ticket),
            'expiresAt' => $issued->expiresAt,
            'invitationId' => $issued->invitationId,
            'attemptReference' => $issued->attemptReference,
            'attemptVersion' => $issued->attemptVersion,
        ];

        if (! $request->expectsJson()) {
            return $answers->backWith(self::ISSUED_LINE, $answer);
        }

        return new JsonResponse($answer, JsonResponse::HTTP_CREATED, ['Cache-Control' => 'no-store, private']);
    }
}
