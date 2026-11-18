<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Grammar\ReadCompound;

/**
 * A subshell or group: its list read through the list pipeline again, then its trailing redirects.
 */
final readonly class ReadCompoundPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            ReadCompound::class,
        ];
    }
}
