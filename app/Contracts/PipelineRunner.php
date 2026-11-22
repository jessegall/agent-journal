<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\Step;

/**
 * What other Core areas use of the Pipelines area's Pipelines.
 */
interface PipelineRunner
{
    /**
     * Runs the input through every step of the definition and returns the output of the last step.
     *
     * @template TOutput of object
     *
     * @param  class-string<PipelineDefinition>  $definition
     * @param  class-string<TOutput>  $output
     * @return TOutput
     */
    public function run(string $definition, object $input, string $output): object;

    /**
     * Runs the input through the steps listed here, in order, with no definition class, and returns the output of
     * the last step.
     *
     * @template TOutput of object
     *
     * @param  list<class-string<Pipable>|Step>  $steps
     * @param  class-string<TOutput>  $output
     * @return TOutput
     */
    public function runSteps(array $steps, object $input, string $output): object;
}
