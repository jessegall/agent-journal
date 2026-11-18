<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Grammar\ReadPipedCommands;

/**
 * A pipeline: an optional ! and commands joined by | or |&.
 */
final readonly class ReadPipelinePipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            ReadPipedCommands::class,
        ];
    }
}
