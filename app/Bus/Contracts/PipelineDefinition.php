<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Pipelines\Support\Step;

/**
 * A pipeline written down: its steps in the order they run. A step is a pipe or another pipeline, named by its class
 * and built by the container, or a Step listed inline: steps repeated while a condition holds, or a step chosen for
 * each value. Each definition says what it takes and hands out: in its docblock as PipelineDefinition<TInput,
 * TOutput>, and in its input and output properties, which the runner checks before the first and after the last step.
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
