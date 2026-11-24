<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\StateLoading\CastConstructorValues;
use App\Pipes\StateLoading\CastPropertyValues;
use App\Support\StateLoading\SavedState;
use App\Support\StateLoading\StateArguments;

/**
 * Casts a state's saved values to the types it declares: first those its constructor takes, then its other data.
 *
 * @implements PipelineDefinition<SavedState, StateArguments>
 */
final readonly class CastStateValuesPipeline implements PipelineDefinition
{
    public string $input = SavedState::class;

    public string $output = StateArguments::class;

    public function pipes(): array
    {
        return [
            CastConstructorValues::class,
            CastPropertyValues::class,
        ];
    }
}
