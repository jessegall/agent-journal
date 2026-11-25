<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Supervision\DrainPart;
use App\Pipes\Supervision\FinishPart;
use App\Support\Execution\SpawnedPart;
use App\Support\Execution\StepOutcome;

/**
 * Reads a started part's output to its end and records how it ended.
 *
 * @implements PipelineDefinition<SpawnedPart, StepOutcome>
 */
final readonly class FinishSpawnedPartPipeline implements PipelineDefinition
{
    public string $input = SpawnedPart::class;

    public string $output = StepOutcome::class;

    public function pipes(): array
    {
        return [
            DrainPart::class,
            FinishPart::class,
        ];
    }
}
