<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines\Merged;

use App\Bus\Contracts\PipelineDefinition;
use Tests\Fixtures\Pipelines\Counted;
use Tests\Fixtures\Pipelines\CountWords;
use Tests\Fixtures\Pipelines\Words;

/**
 * Counts the words after the first two, through a small pipeline that only it runs.
 *
 * @implements PipelineDefinition<Words, Counted>
 */
final readonly class CountAfterTwoWordsPipeline implements PipelineDefinition
{
    public string $input = Words::class;

    public string $output = Counted::class;

    public function pipes(): array
    {
        return [
            DropTwoWordsPipeline::class,
            CountWords::class,
        ];
    }
}
