<?php

declare(strict_types=1);

namespace App\Processes\Pipes;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\AnalyseLinePipeline;
use App\Processes\Stages\ReadSource;
use App\Processes\Stages\ShellSource;

/**
 * Reads the whole line through the line pipeline, the same one every substitution inside it runs.
 *
 * @extends PipelineAdapter<ShellSource, ReadSource>
 */
final readonly class AnalyseLine extends PipelineAdapter
{
    protected function definition(): string
    {
        return AnalyseLinePipeline::class;
    }

    protected function produces(): string
    {
        return ReadSource::class;
    }

    protected function into(object $stage): ShellSource
    {
        return $stage;
    }

    protected function back(object $result, object $stage): ReadSource
    {
        return $result;
    }
}
