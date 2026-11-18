<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Http\Requests\CreatePlanRequest;
use Illuminate\Http\JsonResponse;

/**
 * Creates a plan for a signed agent call by running CreatePlan, and answers its id.
 */
final readonly class CreatePlanController
{
    public function __invoke(CreatePlanRequest $request, CommandBus $commands): JsonResponse
    {
        return new JsonResponse(['planId' => $commands->run($request->command())], JsonResponse::HTTP_CREATED);
    }
}
