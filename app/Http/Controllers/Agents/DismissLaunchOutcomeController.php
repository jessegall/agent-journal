<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Agents\DismissLaunchOutcomeRequest;
use Illuminate\Http\JsonResponse;

/**
 * Hides one version of an agent's launch outcome from the user who dismisses it.
 */
final readonly class DismissLaunchOutcomeController
{
    public function __invoke(DismissLaunchOutcomeRequest $request, string $agent, CommandBus $commands): JsonResponse
    {
        $commands->run($request->command($agent));

        return new JsonResponse(['dismissed' => true]);
    }
}
