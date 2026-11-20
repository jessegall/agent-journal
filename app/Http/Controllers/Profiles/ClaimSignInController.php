<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Agents\Support\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\ClaimSignIn;
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
        $claimed = $commands->run(new ClaimSignIn($host->hostId));

        return $claimed === null
            ? new Response(status: Response::HTTP_NO_CONTENT)
            : new JsonResponse([
                'attempt_id' => $claimed->attemptId,
                'program' => $claimed->program,
                'method' => $claimed->method->value,
                'directory' => $claimed->directory,
                'generation' => $claimed->generation,
                'expires_at' => $claimed->expiresAt,
                'account_id' => $claimed->accountId,
            ]);
    }
}
