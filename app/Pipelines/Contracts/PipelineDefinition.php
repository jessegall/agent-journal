<?php

declare(strict_types=1);

namespace App\Pipelines\Contracts;

/**
 * A pipeline written down: the pipes in the order they run, each named by its class and built by the container.
 */
interface PipelineDefinition
{
    /**
     * @return list<class-string<Pipe>>
     */
    public function pipes(): array;
}
