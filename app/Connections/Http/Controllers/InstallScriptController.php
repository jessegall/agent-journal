<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use Illuminate\Http\Response;

/**
 * Answers the URL of an install line. Every refusal is the same generic failure, so the answer never tells whether
 * remote projects are switched on or a ticket exists; until invitations are recorded no ticket is redeemable, so every
 * ticket gets it.
 */
final readonly class InstallScriptController
{
    private const string FAILURE = "journal: this install line cannot be used. Copy a new one from the journal.\n";

    public function __invoke(): Response
    {
        return new Response(self::FAILURE, Response::HTTP_NOT_FOUND, [
            'Content-Type' => 'text/plain; charset=utf-8',
            'Cache-Control' => 'no-store, private',
        ]);
    }
}
