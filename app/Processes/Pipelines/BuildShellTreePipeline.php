<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\FinishTree;
use App\Processes\Pipes\StartAnalysis;

/**
 * A whole shell line: a fresh draft, the line read as its first source, and the finished tree.
 */
final readonly class BuildShellTreePipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            StartAnalysis::class,
            ReadSourcePipeline::class,
            FinishTree::class,
        ];
    }
}
