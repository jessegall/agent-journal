<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Commands\Accounts\ClaimSignIn\ClaimSignInCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Hands the host's sign-in runner the oldest sign-in nobody runs, or nothing. The host's calls run as the journal
 * itself: a host is infrastructure, never an actor.
 */
final readonly class ClaimSignInController
{
    public function __invoke(HostContext $host, CommandBus $commands): JsonResponse|Response
    {
        $claimed = $commands->run(new ClaimSignInCommand($host->hostId));

        if ($claimed === null) {
            return new Response(status: Response::HTTP_NO_CONTENT);
        }

        return new JsonResponse([
                'attempt_id' => $claimed->attemptId,
                'driver' => $claimed->driver,
                'method' => $claimed->method->value,
                'directory' => $claimed->directory,
                'generation' => $claimed->generation,
                'expires_at' => $claimed->expiresAt,
                'account_id' => $claimed->accountId,
            ]);
    }
}
