<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Agents\Support\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\TakeSignInCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Hands the host's runner the code the user typed, once, or nothing. The host's calls run as the journal itself.
 */
final readonly class TakeSignInCodeController
{
    public function __invoke(string $attempt, HostContext $host, CommandBus $commands): JsonResponse|Response
    {
        $code = $commands->run(new TakeSignInCode($host->hostId, $attempt));

        return $code === null
            ? new Response(status: Response::HTTP_NO_CONTENT)
            : new JsonResponse(['code' => $code], headers: ['Cache-Control' => 'no-store']);
    }
}
