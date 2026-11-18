<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Http\Requests\CancelPlanRequest;
use Illuminate\Http\JsonResponse;

/**
 * Runs CancelPlan for a signed agent call and answers the plan id.
 */
final readonly class CancelPlanController
{
    public function __invoke(CancelPlanRequest $request, CommandBus $commands): JsonResponse
    {
        $command = $request->command();
        $commands->run($command);

        return new JsonResponse(['planId' => $command->planId]);
    }
}
