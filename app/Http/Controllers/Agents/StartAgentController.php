<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Agents\StartAgentRequest;
use Illuminate\Http\JsonResponse;

/**
 * Starts a user's main agent with the program and model they named, and answers the receipt.
 */
final readonly class StartAgentController
{
    public function __invoke(StartAgentRequest $request, CommandBus $commands): JsonResponse
    {
        $receipt = $commands->run($request->command());
        $selection = $receipt->selection;

        return new JsonResponse([
            'sessionId' => $receipt->sessionId,
            'newSession' => $receipt->newSession,
            'driver' => $selection->driver->value,
            'requestedModel' => $selection->requested->model,
            'resolvedModel' => $selection->model,
            'actualModel' => $receipt->actualModel,
        ]);
    }
}
