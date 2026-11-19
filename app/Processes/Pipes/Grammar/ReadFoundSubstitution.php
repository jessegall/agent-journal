<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadSourcePipeline;
use App\Processes\Values\Grammar\SubstitutionQueue;
use App\Processes\Values\Lines\ReadSource;
use App\Processes\Values\Lines\ShellSource;

/**
 * Reads a found substitution as a line of its own, through the line pipeline one level deeper.
 *
 * @extends PipelineAdapter<SubstitutionQueue, ReadSource>
 */
final readonly class ReadFoundSubstitution extends PipelineAdapter
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

    protected function back(object $result, object $input): SubstitutionQueue
    {
        return $input;
    }
}
