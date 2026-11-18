<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Http\Requests\EditPlanRequest;
use Illuminate\Http\JsonResponse;

/**
 * Edits a plan for a signed agent call by running EditPlan, and answers its new revision; a stale revision is a 409.
 */
final readonly class EditPlanController
{
    public function __invoke(EditPlanRequest $request, CommandBus $commands): JsonResponse
    {
        $command = $request->command();

        return new JsonResponse(['planId' => $command->planId, 'revision' => $commands->run($command)]);
    }
}
