<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Http\Requests\EndPlanRequest;
use Illuminate\Http\JsonResponse;

/**
 * Runs FinishPlan or CancelPlan for a signed agent call, as the route's end type says, and answers the plan id.
 */
final readonly class EndPlanController
{
    public function __invoke(EndPlanRequest $request, CommandBus $commands): JsonResponse
    {
        $command = $request->command();
        $commands->run($command);

        return new JsonResponse(['planId' => $command->planId]);
    }
}
