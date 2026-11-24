<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Commands\Sessions\ClaimStartGrant\ClaimStartGrantCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Hands the host a Starting runtime's start token and the folders it writes before spawning, once; a second
 * claim gets a 410. The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class StartGrantController
{
    public function __invoke(string $runtime, HostContext $host, CommandBus $commands): JsonResponse
    {
        $grant = $commands->run(new ClaimStartGrantCommand($host->hostId, $runtime));

        if ($grant === null) {
            return new JsonResponse(['message' => 'This start was already granted.'], Response::HTTP_GONE);
        }

        return new JsonResponse($grant->toArray());
    }
}
