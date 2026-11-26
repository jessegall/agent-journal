<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines;

use App\Bus\Contracts\PipelineDefinition;

/**
 * A fixture pipeline of one pipe, run twice when its pipe is listed twice: the second run is handed a Counted.
 *
 * @implements PipelineDefinition<Words, Counted>
 */
final readonly class CountWordsPipeline implements PipelineDefinition
{
    public function __construct(private int $times = 1) {}

    public string $input = Words::class;

    public string $output = Counted::class;

    public function pipes(): array
    {
        return array_fill(0, $this->times, CountWords::class);
    }
}
