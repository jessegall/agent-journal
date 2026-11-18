<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\AnalyseLine;
use App\Processes\Pipes\FinishTree;
use App\Processes\Pipes\StartAnalysis;

/**
 * One shell line, from the text an agent wrote to its ShellTree: a draft is opened, the line is read through the line
 * pipeline, and the draft becomes the tree.
 */
final readonly class ShellAnalysisPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            StartAnalysis::class,
            AnalyseLine::class,
            FinishTree::class,
        ];
    }
}
