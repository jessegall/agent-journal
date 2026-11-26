<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Accounts\Commands\ClaimCleanup\ClaimCleanupCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Values\HostContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Hands the host's runner the next cleanup, or nothing. The host's calls run as the journal itself.
 */
final readonly class ClaimCleanupController
{
    #[Dispatches(ClaimCleanupCommand::class)]
    public function __invoke(HostContext $host, CommandBus $commands): JsonResponse|Response
    {
        $claimed = $commands->run(new ClaimCleanupCommand($host->hostId));

        if ($claimed === null) {
            return new Response(status: Response::HTTP_NO_CONTENT);
        }

        return new JsonResponse([
            'target' => $claimed->target->value,
            'id' => $claimed->id,
            'driver' => $claimed->driver,
            'method' => $claimed->method->value,
            'directory' => $claimed->directory,
            'generation' => $claimed->generation,
            'store_removed' => $claimed->isStoreRemoved,
            'account_id' => $claimed->accountId,
        ]);
    }
}
