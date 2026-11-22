<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\FinishTree;
use App\Pipes\StartAnalysis;

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
