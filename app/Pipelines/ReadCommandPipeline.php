<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Grammar\CheckCommandStart;
use App\Support\Grammar\CommandToParse;
use App\Support\Grammar\NodeRead;
use App\Support\Step;
use App\Support\Syntax\CommandReaders\CommandReaderResolver;

/**
 * command: the time budget and the start checked, then the reader for its kind.
 *
 * @implements PipelineDefinition<CommandToParse, NodeRead>
 */
final readonly class ReadCommandPipeline implements PipelineDefinition
{
    public string $input = CommandToParse::class;

    public string $output = NodeRead::class;

    public function pipes(): array
    {
        return [
            CheckCommandStart::class,
            Step::resolvedBy(fn (CommandToParse $toParse) => CommandReaderResolver::readerAt($toParse->cursor())),
        ];
    }
}
