<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Contracts\PipelineDefinition;

/**
 * A pipe that runs another pipeline: it turns its own stage into the inner pipeline's first stage, runs that pipeline,
 * and turns the inner result and its own stage into the stage it hands on. Neither pipeline names the other's stages.
 *
 * @template TStage of object
 * @template TResult of object
 */
abstract readonly class PipelineAdapter implements Pipe
{
    public function __construct(private Pipelines $pipelines) {}

    /**
     * @return class-string<PipelineDefinition>
     */
    abstract protected function definition(): string;

    /**
     * @return class-string<TResult>
     */
    abstract protected function produces(): string;

    /**
     * @param  TStage  $stage
     */
    abstract protected function into(object $stage): object;

    /**
     * @param  TResult  $result
     * @param  TStage  $stage
     */
    abstract protected function back(object $result, object $stage): object;

    /**
     * @param  TStage  $stage
     */
    public function handle(object $stage): object
    {
        return $this->back($this->pipelines->run($this->definition(), $this->into($stage), $this->produces()), $stage);
    }
}
