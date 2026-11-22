<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadSourcePipeline;
use App\Support\Grammar\SubstitutionQueue;
use App\Support\Lines\ReadSource;
use App\Support\Lines\ShellSource;
use App\Support\PipelineAdapter;

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
