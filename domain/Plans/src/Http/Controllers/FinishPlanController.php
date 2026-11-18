<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Http\Requests\FinishPlanRequest;
use Illuminate\Http\JsonResponse;

/**
 * Runs FinishPlan for a signed agent call and answers the plan id.
 */
final readonly class FinishPlanController
{
    public function __invoke(FinishPlanRequest $request, CommandBus $commands): JsonResponse
    {
        $command = $request->command();
        $commands->run($command);

        return new JsonResponse(['planId' => $command->planId]);
    }
}
