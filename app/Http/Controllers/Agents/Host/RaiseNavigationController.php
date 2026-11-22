<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Commands\RaiseNavigation\RaiseNavigationCommand;
use App\Contracts\CommandBus;
use App\Data\Agents\NavigationRaiseData;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * Takes a host's raise at an uncertain point of a key script run and answers whether a navigation request is open,
 * the user holds it, or the host waits. The host's calls run as the journal itself, never an actor.
 */
final readonly class RaiseNavigationController
{
    public function __invoke(
        string $runtime,
        NavigationRaiseData $raise,
        HostContext $host,
        CommandBus $commands,
    ): JsonResponse {
        $answer = $commands->run(new RaiseNavigationCommand(
            $host->hostId,
            $runtime,
            $raise->operationKey,
            $raise->requestId,
            $raise->attempt,
            $raise->uncertainty(),
            $raise->declinedEntries,
        ));

        return new JsonResponse($answer);
    }
}
