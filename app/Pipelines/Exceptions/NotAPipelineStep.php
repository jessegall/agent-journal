<?php

declare(strict_types=1);

namespace App\Pipelines\Exceptions;

use LogicException;

/**
 * A pipeline lists a class that is neither a pipe nor a pipeline.
 */
final class NotAPipelineStep extends LogicException
{
    public static function named(string $class): self
    {
        return new self("[{$class}] is listed as a step of a pipeline, but it is no pipe or pipeline.");
    }
}
