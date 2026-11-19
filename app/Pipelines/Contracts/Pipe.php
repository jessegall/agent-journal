<?php

declare(strict_types=1);

namespace App\Pipelines\Contracts;

/**
 * One step of a pipeline: its handle method takes the input the step before handed on and returns its output. Each
 * pipe types its own input and output, so the method is declared here only for callers.
 *
 * @method object handle(object $input)
 */
interface Pipe extends Pipable {}
