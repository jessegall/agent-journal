<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines;

use App\Bus\Contracts\PipelineDefinition;

/**
 * A fixture pipeline that declares Words as its output but ends on the Counted its one pipe hands out.
 *
 * @implements PipelineDefinition<Words, Words>
 */
final readonly class CountIntoWordsPipeline implements PipelineDefinition
{
    public string $input = Words::class;

    public string $output = Words::class;

    public function pipes(): array
    {
        return [CountWords::class];
    }
}
