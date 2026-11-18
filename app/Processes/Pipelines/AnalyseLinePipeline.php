<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\BuildTree;
use App\Processes\Pipes\GuardDepth;
use App\Processes\Pipes\ScanTokens;

/**
 * One source read into the draft: the whole line, or the inside of a substitution, which BuildTree sends through this
 * same pipeline one level deeper, so nesting is the pipeline running itself.
 */
final readonly class AnalyseLinePipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            GuardDepth::class,
            ScanTokens::class,
            BuildTree::class,
        ];
    }
}
