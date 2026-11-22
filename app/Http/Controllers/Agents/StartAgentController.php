<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Bus\Contracts\CommandBus;
use App\Drivers\Contracts\DriverCatalogue;
use App\Http\Requests\Agents\StartAgentRequest;
use Illuminate\Http\JsonResponse;

/**
 * Starts a user's main agent with the driver and model they named, and answers the receipt.
 */
final readonly class StartAgentController
{
    public function __invoke(StartAgentRequest $request, CommandBus $commands, DriverCatalogue $drivers): JsonResponse
    {
        $receipt = $commands->run($request->command($drivers));
        $selection = $receipt->selection;

        return new JsonResponse([
            'sessionId' => $receipt->sessionId,
            'newSession' => $receipt->newSession,
            'driver' => $selection->driver,
            'requestedModel' => $selection->requested->model,
            'resolvedModel' => $selection->model,
            'actualModel' => $receipt->actualModel,
        ]);
    }
}
