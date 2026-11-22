<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Commands\TakeSignInCode\TakeSignInCodeCommand;
use App\Contracts\CommandBus;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Tells the host's runner whether its attempt is still live in the generation it runs in, with the code the user
 * typed, once. The host's calls run as the journal itself.
 */
final readonly class TakeSignInCodeController
{
    public function __invoke(string $attempt, Request $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $poll = $commands->run(new TakeSignInCodeCommand($host->hostId, $attempt, $request->integer('generation')));

        return new JsonResponse(
            ['live' => $poll->isLive, 'code' => $poll->code],
            headers: ['Cache-Control' => 'no-store'],
        );
    }
}
