<?php

declare(strict_types=1);

namespace App\Pipelines\Contracts;

/**
 * One step of a pipeline: its handle method takes the stage the step before handed on and returns the next stage. Each
 * pipe types its own stages, so the method is declared here only for callers.
 *
 * @method object handle(object $stage)
 */
interface Pipe {}
