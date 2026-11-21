<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\RenewRuntimeLease;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Renews a runtime's execution lease for its binding's relay.
 */
final readonly class RuntimeLeaseController
{
    public function __invoke(
        string $binding,
        string $runtime,
        Request $request,
        HostContext $host,
        CommandBus $commands,
    ): JsonResponse {
        $lease = $commands->run(new RenewRuntimeLease(
            $host->hostId,
            $binding,
            $runtime,
            $request->integer('authorityGeneration'),
            $request->integer('runtimeGeneration'),
        ));

        return new JsonResponse([
            'runtimeId' => $lease->runtimeId,
            'generation' => $lease->generation,
            'serverTime' => $lease->serverTime,
            'expiresAt' => $lease->expiresAt,
        ]);
    }
}
