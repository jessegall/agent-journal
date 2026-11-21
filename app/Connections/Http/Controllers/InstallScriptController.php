<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Agents\Support\InstallLineAvailability;
use App\Connections\Exceptions\InvitationUnusable;
use App\Connections\Models\ProjectInvitation;
use App\Connections\Support\InstallScript;
use Illuminate\Http\Response;

/**
 * Answers the URL of an install line with the script for its ticket. Fetching never spends the line. Every refusal
 * is the same generic failure, so the answer never tells whether connecting is switched on or whether the line is
 * unknown, expired, spent or revoked.
 */
final readonly class InstallScriptController
{
    private const string FAILURE = "journal: this install line cannot be used. Copy a new one from the journal.\n";

    private const array HEADERS = [
        'Content-Type' => 'text/plain; charset=utf-8',
        'Cache-Control' => 'no-store, private',
    ];

    public function __invoke(string $ticket, InstallLineAvailability $availability, InstallScript $script): Response
    {
        if (! $availability->canIssue()) {
            return new Response(self::FAILURE, Response::HTTP_NOT_FOUND, self::HEADERS);
        }

        try {
            ProjectInvitation::redeemableFor($ticket);
        } catch (InvitationUnusable) {
            return new Response(self::FAILURE, Response::HTTP_NOT_FOUND, self::HEADERS);
        }

        return new Response($script->render($ticket), Response::HTTP_OK, self::HEADERS);
    }
}
