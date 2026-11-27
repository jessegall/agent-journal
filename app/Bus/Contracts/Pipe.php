<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

/**
 * One step of a pipeline. Its handle method takes the carried value, or the PipelineContext, and returns the value to
 * carry on; a handle that also takes Closure $next calls $next with the value to carry on and returns the pipeline's
 * output itself. Each pipe types its own handle, so the method is declared here only for callers.
 *
 * @method object handle(object $input, \Closure $next = null)
 */
interface Pipe extends Pipable {}
