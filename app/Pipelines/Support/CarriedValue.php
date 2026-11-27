<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Bus\Contracts\PipelineContext;

/**
 * The context a pipe that takes one is handed: the value carried to it.
 */
final readonly class CarriedValue implements PipelineContext
{
    public function __construct(private object $carried) {}

    public function carried(): object
    {
        return $this->carried;
    }
}
