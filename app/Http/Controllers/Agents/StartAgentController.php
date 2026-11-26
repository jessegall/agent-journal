<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Agents\StartAgentRequest;
use App\Sessions\Contracts\BuiltInStartProfiles;
use App\Sessions\StartPreviews;
use Illuminate\Http\JsonResponse;

/**
 * Starts a user's main agent with the driver and model they named, and answers the receipt.
 */
final readonly class StartAgentController
{
    #[Dispatches(StartAgentCommand::class)]
    public function __invoke(
        StartAgentRequest $request,
        CommandBus $commands,
        DriverCatalogue $drivers,
        BuiltInStartProfiles $profiles,
        StartPreviews $previews,
    ): JsonResponse {
        $receipt = $commands->run($request->command($drivers, $profiles, $previews));
        $selection = $receipt->selection;

        return new JsonResponse([
            'sessionId' => $receipt->sessionId,
            'newSession' => $receipt->isNewSession,
            'driver' => $selection->driver,
            'requestedModel' => $selection->requested->model,
            'resolvedModel' => $selection->model,
            'actualModel' => $receipt->actualModel,
        ]);
    }
}
