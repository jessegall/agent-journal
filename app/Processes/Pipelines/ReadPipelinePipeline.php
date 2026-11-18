<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Grammar\ReadPipeline;

/**
 * A pipeline: an optional ! and commands joined by | or |&.
 */
final readonly class ReadPipelinePipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            ReadPipeline::class,
        ];
    }
}
