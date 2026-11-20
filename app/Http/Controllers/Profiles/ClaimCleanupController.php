<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Agents\Support\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\ClaimCleanup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Hands the host's runner the next cleanup, or nothing. The host's calls run as the journal itself.
 */
final readonly class ClaimCleanupController
{
    public function __invoke(HostContext $host, CommandBus $commands): JsonResponse|Response
    {
        $claimed = $commands->run(new ClaimCleanup($host->hostId));

        return $claimed === null
            ? new Response(status: Response::HTTP_NO_CONTENT)
            : new JsonResponse([
                'target' => $claimed->target->value,
                'id' => $claimed->id,
                'program' => $claimed->program,
                'method' => $claimed->method->value,
                'directory' => $claimed->directory,
                'generation' => $claimed->generation,
                'store_removed' => $claimed->isStoreRemoved,
            ]);
    }
}
