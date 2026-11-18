<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Bus\Contracts\CommandBus;
use App\Processes\Commands\SettleSample;
use Illuminate\Http\JsonResponse;

/**
 * Judges a request's ended sample run and answers where the request stands and which exits still lack a sample.
 */
final readonly class SettleSampleController
{
    public function __invoke(string $commandRequest, CommandBus $commands): JsonResponse
    {
        $outcome = $commands->run(new SettleSample($commandRequest));

        return new JsonResponse([
            'state' => $outcome->state->value,
            'run_id' => $outcome->runId,
            'unsampled_statuses' => $outcome->unsampledStatuses,
        ]);
    }
}
