<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Grammar\Lines\ReadSource;
use App\Processes\Grammar\Lines\ShellSource;
use App\Processes\Grammar\Pipelines\ReadSourcePipeline;
use App\Processes\Grammar\SubstitutionQueue;

/**
 * Reads a found substitution as a line of its own, through the line pipeline one level deeper.
 *
 * @extends PipelineAdapter<SubstitutionQueue, ReadSource>
 */
final readonly class ParseFoundSubstitution extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadSourcePipeline::class;
    }

    protected function produces(): string
    {
        return ReadSource::class;
    }

    protected function into(object $input): ShellSource
    {
        return $input->foundSource();
    }

    protected function back(object $parsedSubstitution, object $input): SubstitutionQueue
    {
        return $input;
    }
}
