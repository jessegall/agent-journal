<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Processes\Grammar\Lines\ReadSource;
use App\Processes\Grammar\Lines\ShellSource;
use App\Processes\Grammar\Pipes\AddSequenceNode;
use App\Processes\Grammar\Pipes\GuardDepth;
use App\Processes\Grammar\Pipes\RequireEndOfSource;
use App\Processes\Grammar\Pipes\ScanTokens;

/**
 * One source, the whole line or a substitution inside it: its depth checked, its tokens scanned and its list read
 * into a Sequence node through the shell grammar's nested pipelines.
 *
 * @implements PipelineDefinition<ShellSource, ReadSource>
 */
final readonly class ReadSourcePipeline implements PipelineDefinition
{
    public string $input = ShellSource::class;

    public string $output = ReadSource::class;

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
