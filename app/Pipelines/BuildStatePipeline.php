<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipes\StateLoading\CastConstructorValues;
use App\Pipes\StateLoading\CastPropertyValues;
use App\Pipes\StateLoading\MakeState;
use App\Pipes\StateLoading\WriteStateValues;
use App\Stacks\AgentState;
use App\Support\StateLoading\SavedState;

/**
 * Builds a state from its saved values: cast them, make the state with its collaborators and constructor data, and
 * write back its other data properties.
 *
 * @implements PipelineDefinition<SavedState, AgentState>
 */
final readonly class BuildStatePipeline implements PipelineDefinition
{
    public string $input = SavedState::class;

    public string $output = AgentState::class;

    public function pipes(): array
    {
        return [
            CastConstructorValues::class,
            CastPropertyValues::class,
            MakeState::class,
            WriteStateValues::class,
        ];
    }
}
