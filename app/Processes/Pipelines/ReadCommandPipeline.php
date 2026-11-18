<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Grammar\ReadCommand;
use App\Processes\Pipes\Grammar\StartCommand;

/**
 * A command: the budget and 'time' are checked first, then the reader for the command's kind reads it.
 */
final readonly class ReadCommandPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            StartCommand::class,
            ReadCommand::class,
        ];
    }
}
