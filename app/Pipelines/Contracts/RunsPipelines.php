<?php

declare(strict_types=1);

namespace App\Pipelines\Contracts;

/**
 * What other Core areas use of the Pipelines area's Pipelines.
 */
interface RunsPipelines
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
}
