<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines\Broken;

use App\Bus\Contracts\PipelineDefinition;
use Tests\Fixtures\Pipelines\Counted;
use Tests\Fixtures\Pipelines\CountWords;
use Tests\Fixtures\Pipelines\DropFirstWord;
use Tests\Fixtures\Pipelines\Words;

/**
 * A pipeline whose second pipe takes words while the first hands it a count, which the pipeline chain test names.
 *
 * @implements PipelineDefinition<Words, Counted>
 */
final readonly class CountDroppedCountPipeline implements PipelineDefinition
{
    public string $input = Words::class;

    public string $output = Counted::class;

    public function pipes(): array
    {
        return [
            CountWords::class,
            DropFirstWord::class,
        ];
    }
}
