<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\StateLoading\CastConstructorValues;
use App\Pipes\StateLoading\CastPropertyValues;

/**
 * Casts a state's saved values to the types it declares: first those its constructor takes, then its other data.
 */
final readonly class CastStateValuesPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            CastConstructorValues::class,
            CastPropertyValues::class,
        ];
    }
}
