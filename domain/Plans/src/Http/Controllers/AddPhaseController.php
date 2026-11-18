<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Http\Requests\AddPhaseRequest;
use Illuminate\Http\JsonResponse;

/**
 * Appends a phase for a signed agent call by running AddPhase under the plan's structure lock, and answers its id.
 */
final readonly class AddPhaseController
{
    public function __invoke(AddPhaseRequest $request, CommandBus $commands): JsonResponse
    {
        return new JsonResponse(['phaseId' => $commands->run($request->command())], JsonResponse::HTTP_CREATED);
    }
}
