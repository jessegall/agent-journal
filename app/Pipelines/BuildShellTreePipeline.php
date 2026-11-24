<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\FinishTree;
use App\Pipes\StartAnalysis;
use App\Support\Lines\ShellLine;
use App\Values\ShellTree;

/**
 * A whole shell line: a fresh draft, the line read as its first source, and the finished tree.
 *
 * @implements PipelineDefinition<ShellLine, ShellTree>
 */
final readonly class BuildShellTreePipeline implements PipelineDefinition
{
    public string $input = ShellLine::class;

    public string $output = ShellTree::class;

    public function pipes(): array
    {
        return [
            StartAnalysis::class,
            ReadSourcePipeline::class,
            FinishTree::class,
        ];
    }
}
