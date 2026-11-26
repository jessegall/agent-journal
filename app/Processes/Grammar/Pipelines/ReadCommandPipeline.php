<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\Pipes\CheckCommandStart;
use App\Processes\Grammar\Syntax\CommandReaders\CommandReaderResolver;
use App\Processes\Grammar\UnparsedCommand;

/**
 * command: the time budget and the start checked, then the reader for its kind.
 *
 * @implements PipelineDefinition<UnparsedCommand, NodeRead>
 */
final readonly class ReadCommandPipeline implements PipelineDefinition
{
    public string $input = UnparsedCommand::class;

    public string $output = NodeRead::class;

    public function pipes(): array
    {
        return [
            CheckCommandStart::class,
            Step::resolvedBy(fn (UnparsedCommand $toParse) => CommandReaderResolver::readerAt($toParse->cursor())),
        ];
    }
}
