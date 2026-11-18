<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Grammar\ReadList;

/**
 * A list of the shell grammar: and-or chains split by separators, each read through the and-or pipeline.
 */
final readonly class ReadListPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            ReadList::class,
        ];
    }
}
