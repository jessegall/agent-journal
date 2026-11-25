<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Api;

use Domain\Plans\Api\ListPhaseChecksPayload;
use Domain\Plans\Api\PhaseChecks;
use Domain\Plans\Models\PhaseCheck;

/**
 * Answers a phase's checks.
 */
final readonly class ListPhaseChecksController
{
    public function __invoke(ListPhaseChecksPayload $call): PhaseChecks
    {
        $phase = $call->phaseOfPlan();
        $checks = PhaseCheck::query()->ofPhase($phase)->limit(100)->get();

        return PhaseChecks::from([
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
