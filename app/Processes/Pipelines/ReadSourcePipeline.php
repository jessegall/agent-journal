<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\AddSequenceNode;
use App\Processes\Pipes\GuardDepth;
use App\Processes\Pipes\RequireEndOfSource;
use App\Processes\Pipes\ScanTokens;

/**
 * One source, the whole line or a substitution inside it: its depth checked, its tokens scanned and its list read
 * into a Sequence node through the shell grammar's nested pipelines (doc 21 revision 3, section 5).
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
