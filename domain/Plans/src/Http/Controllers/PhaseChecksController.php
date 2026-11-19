<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use Domain\Plans\Http\Requests\PhaseCheckRequest;
use Domain\Plans\Models\PhaseCheck;
use Illuminate\Http\JsonResponse;

/**
 * The check results a phase relies on, newest first.
 */
final readonly class PhaseChecksController
{
    public function __invoke(PhaseCheckRequest $request): JsonResponse
    {
        $phase = $request->phase();
        $checks = PhaseCheck::query()->ofPhase($phase)->readLimit(100)->get();

        return new JsonResponse([
            'phase' => $phase->number,
            'title' => $phase->title,
            'checks' => $checks->map(fn (PhaseCheck $check) => [
                'operation' => $check->operation,
                'outcome' => $check->outcome,
                'receipt' => $check->receipt_id,
                'recorded_by' => "{$check->actor_type}:{$check->actor_id}",
            ])->all(),
        ]);
    }
}
