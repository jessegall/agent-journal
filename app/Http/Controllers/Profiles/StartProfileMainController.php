<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Profiles\StartProfileMainRequest;
use Illuminate\Http\JsonResponse;

/**
 * Starts a main agent from a profile that coordinates the journal's work and answers with the start's session,
 * program and model.
 */
final readonly class StartProfileMainController
{
    public function __invoke(StartProfileMainRequest $request, CommandBus $commands): JsonResponse
    {
        $receipt = $commands->run($request->command());

        return new JsonResponse([
            'sessionId' => $receipt->sessionId,
            'newSession' => $receipt->newSession,
            'programArguments' => $receipt->programArguments,
        ]);
    }
}
