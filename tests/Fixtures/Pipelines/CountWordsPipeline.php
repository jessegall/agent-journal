<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines;

use App\Contracts\PipelineDefinition;

/**
 * A fixture pipeline of one pipe, run twice when its pipe is listed twice: the second run is handed a Counted.
 */
final readonly class CountWordsPipeline implements PipelineDefinition
{
    public function __construct(private int $times = 1) {}

    public function pipes(): array
    {
        return array_fill(0, $this->times, CountWords::class);
    }
}
