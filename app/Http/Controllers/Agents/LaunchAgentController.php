<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Agents\LaunchAgentRequest;
use Illuminate\Http\JsonResponse;

/**
 * Launches a person's main agent with the program and model they named, and answers the receipt.
 */
final readonly class LaunchAgentController
{
    public function __invoke(LaunchAgentRequest $request, CommandBus $commands): JsonResponse
    {
        $receipt = $commands->run($request->command());
        $selection = $receipt->selection;

        return new JsonResponse([
            'sessionId' => $receipt->sessionId,
            'newSession' => $receipt->newSession,
            'program' => $selection->program->value,
            'requestedModel' => $selection->requested->model,
            'resolvedModel' => $selection->model,
            'actualModel' => $receipt->actualModel,
        ]);
    }
}
