<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines;

use App\Bus\Contracts\PipelineDefinition;

/**
 * A fixture pipeline of every pipe form: the context passed on, an empty text answered without the rest, then counted.
 *
 * @implements PipelineDefinition<Words, Counted>
 */
final readonly class CountTextPipeline implements PipelineDefinition
{
    public string $input = Words::class;

    public string $output = Counted::class;

    public function pipes(): array
    {
        return [
            PassCarried::class,
            CountNothingOfEmptyText::class,
            CountWords::class,
        ];
    }
}
