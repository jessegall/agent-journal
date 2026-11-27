<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines\Merged;

use App\Bus\Contracts\PipelineDefinition;
use Tests\Fixtures\Pipelines\DropFirstWord;
use Tests\Fixtures\Pipelines\Words;

/**
 * A pipeline of two pipes that only CountAfterTwoWordsPipeline runs, which the pipeline merge test names.
 *
 * @implements PipelineDefinition<Words, Words>
 */
final readonly class DropTwoWordsPipeline implements PipelineDefinition
{
    public string $input = Words::class;

    public string $output = Words::class;

    public function pipes(): array
    {
        return [
            DropFirstWord::class,
            DropFirstWord::class,
        ];
    }
}
