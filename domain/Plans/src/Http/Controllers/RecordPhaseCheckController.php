<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Commands\RecordPhaseCheck;
use Domain\Plans\Http\Requests\PhaseCheckRequest;
use Illuminate\Http\JsonResponse;

/**
 * Records a validated check result on a phase.
 */
final readonly class RecordPhaseCheckController
{
    public function __invoke(PhaseCheckRequest $request, CommandBus $commands): JsonResponse
    {
        $checkId = $commands->run(new RecordPhaseCheck($request->phase()->id, $request->receiptId()));

        return new JsonResponse(['check_id' => $checkId]);
    }
}
