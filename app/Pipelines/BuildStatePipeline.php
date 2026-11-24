<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\StateLoading\MakeState;
use App\Pipes\StateLoading\WriteStateValues;
use App\Support\StateLoading\BuiltState;
use App\Support\StateLoading\SavedState;

/**
 * Builds a state from its saved values: cast them, make the state with its collaborators and constructor data, and
 * write back its other data properties.
 *
 * @implements PipelineDefinition<SavedState, BuiltState>
 */
final readonly class BuildStatePipeline implements PipelineDefinition
{
    public string $input = SavedState::class;

    public string $output = BuiltState::class;

    public function pipes(): array
    {
        return [
            CastStateValuesPipeline::class,
            MakeState::class,
            WriteStateValues::class,
        ];
    }
}
