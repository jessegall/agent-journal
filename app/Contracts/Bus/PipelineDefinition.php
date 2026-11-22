<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Support\Step;

/**
 * A pipeline written down: its steps in the order they run. A step is a pipe or another pipeline, named by its class
 * and built by the container, or a Step listed inline: steps repeated while a condition holds, or a step chosen for
 * each value.
 */
interface PipelineDefinition extends Pipable
{
    /**
     * @return list<class-string<Pipable>|Step>
     */
    public function pipes(): array;
}
