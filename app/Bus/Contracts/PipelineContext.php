<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

/**
 * The run of a pipeline as a pipe sees it: the value carried to the pipe. A pipe that takes the context instead of
 * the value is one that does not need to know the value's type, such as middleware written for any pipeline.
 */
interface PipelineContext
{
    /**
     * The value the step before carried to this pipe.
     */
    public function carried(): object;
}
