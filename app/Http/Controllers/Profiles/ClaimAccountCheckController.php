<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Commands\Accounts\ClaimAccountCheck\ClaimAccountCheckCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Hands the host's runner the next account to check, or nothing. The host's calls run as the journal itself.
 */
final readonly class ClaimAccountCheckController
{
    public function __invoke(HostContext $host, CommandBus $commands): JsonResponse|Response
    {
        $claimed = $commands->run(new ClaimAccountCheckCommand($host->hostId));

        if ($claimed === null) {
            return new Response(status: Response::HTTP_NO_CONTENT);
        }

        return new JsonResponse([
            'account_id' => $claimed->accountId,
            'driver' => $claimed->driver,
            'method' => $claimed->method->value,
            'directory' => $claimed->directory,
            'generation' => $claimed->generation,
        ]);
    }
}
