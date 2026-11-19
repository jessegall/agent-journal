<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Pipes\Grammar\CheckCommandStart;
use App\Processes\Syntax\CommandReaders\CommandReaderResolver;
use App\Processes\Values\Grammar\CommandReading;

/**
 * command: the time budget and the start checked, then the reader for its kind.
 */
final readonly class ReadCommandPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            CheckCommandStart::class,
            Step::resolvedBy(fn (CommandReading $reading) => CommandReaderResolver::readerAt($reading->cursor())),
        ];
    }
}
