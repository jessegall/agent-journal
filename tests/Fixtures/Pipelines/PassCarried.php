<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines;

use App\Bus\Contracts\Pipe;
use App\Bus\Contracts\PipelineContext;

/**
 * A fixture pipe that takes the context and carries its value on as it came.
 */
final readonly class PassCarried implements Pipe
{
    public function handle(PipelineContext $context): object
    {
        return $context->carried();
    }
}
