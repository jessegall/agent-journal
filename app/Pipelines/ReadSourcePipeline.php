<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\AddSequenceNode;
use App\Pipes\GuardDepth;
use App\Pipes\RequireEndOfSource;
use App\Pipes\ScanTokens;

/**
 * One source, the whole line or a substitution inside it: its depth checked, its tokens scanned and its list read
 * into a Sequence node through the shell grammar's nested pipelines.
 */
final readonly class ReadSourcePipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            GuardDepth::class,
            ScanTokens::class,
            AddSequenceNode::class,
            ReadListPipeline::class,
            RequireEndOfSource::class,
        ];
    }
}
