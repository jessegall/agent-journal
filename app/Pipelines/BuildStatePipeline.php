<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\StateLoading\MakeState;
use App\Pipes\StateLoading\WriteStateValues;

/**
 * Builds a state from its saved values: cast them, make the state with its collaborators and constructor data, and
 * write back its other data properties.
 */
final readonly class BuildStatePipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            CastStateValuesPipeline::class,
            MakeState::class,
            WriteStateValues::class,
        ];
    }
}
