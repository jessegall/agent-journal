<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Profiles\LaunchProfileMainRequest;
use Illuminate\Http\JsonResponse;

/**
 * Launches a main agent from a main_agent profile and answers with the launch's session, program and model.
 */
final readonly class LaunchProfileMainController
{
    public function __invoke(LaunchProfileMainRequest $request, CommandBus $commands): JsonResponse
    {
        $receipt = $commands->run($request->command());

        return new JsonResponse([
            'sessionId' => $receipt->sessionId,
            'newSession' => $receipt->newSession,
            'programArguments' => $receipt->programArguments,
        ]);
    }
}
