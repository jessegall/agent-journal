<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Pipelines\Support\Step;

/**
 * A pipeline written down: its steps in order, each a pipe, another pipeline or an inline Step. It declares what it
 * takes and hands out as PipelineDefinition<TInput, TOutput> and in its input and output properties, which the runner
 * checks.
 *
 * @template-covariant TInput of object
 * @template-covariant TOutput of object
 */
interface PipelineDefinition extends Pipable
{
    /**
     * The type of the value the pipeline takes.
     *
     * @var class-string<TInput>
     */
    public string $input { get; }

    /**
     * The type of the value the pipeline hands out.
     *
     * @var class-string<TOutput>
     */
    public string $output { get; }

    /**
     * @return list<class-string<Pipable>|Step>
     */
    public function pipes(): array;
}
