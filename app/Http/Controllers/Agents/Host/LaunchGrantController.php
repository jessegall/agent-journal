<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\ClaimLaunchGrant;
use App\Agents\Support\HostContext;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Hands the host a Starting runtime's launch credential and the folders it writes before spawning, once; a second
 * claim gets a 410. The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class LaunchGrantController
{
    public function __invoke(string $runtime, HostContext $host, CommandBus $commands): JsonResponse
    {
        $grant = $commands->run(new ClaimLaunchGrant($host->hostId, $runtime));

        return $grant === null
            ? new JsonResponse(['message' => 'This launch was already granted.'], Response::HTTP_GONE)
            : new JsonResponse($grant->toArray());
    }
}
