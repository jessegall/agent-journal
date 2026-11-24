<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\Pipe;
use App\Contracts\Bus\PipelineDefinition;

/**
 * A pipe that runs another pipeline: it turns its own input into the inner pipeline's input, runs that pipeline, and
 * turns the inner output and its own input into the output it hands on. Neither pipeline names the other's values.
 *
 * @template TInput of object
 * @template TResult of object
 */
abstract readonly class PipelineAdapter implements Pipe
{
    /**
     * Takes the runner that runs the pipeline this adapter names.
     */
    public function __construct(private PipelineRunner $pipelines) {}

    /**
     * @return class-string<PipelineDefinition>
     */
    abstract protected function definition(): string;

    /**
     * @return class-string<TResult>
     */
    abstract protected function produces(): string;

    /**
     * @param  TInput  $input
     */
    abstract protected function into(object $input): object;

    /**
     * @param  TResult  $pipelineOutput
     * @param  TInput  $input
     */
    abstract protected function back(object $pipelineOutput, object $input): object;

    /**
     * @param  TInput  $input
     */
    public function handle(object $input): object
    {
        $pipelineOutput = $this->pipelines->run($this->definition(), $this->into($input), $this->produces());

        return $this->back($pipelineOutput, $input);
    }
}
