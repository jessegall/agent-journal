<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Grammar\ReadAndOr;

/**
 * An and-or chain: pipelines joined by && and || from the left.
 */
final readonly class ReadAndOrPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            ReadAndOr::class,
        ];
    }
}
