<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Support\Step;

/**
 * A fixture pipeline with steps listed inline: it drops all words but the last, one each round, then counts what is
 * left through a chosen step, the nested counting pipeline or CountNothing for an empty text.
 */
final readonly class CountLastWordPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            Step::repeated(DropFirstWord::class,
                while: fn (Words $words) => str_word_count($words->text) > 1
            ),
            Step::chosen(fn (Words $words) => $words->text,
                then: CountWordsPipeline::class,
                else: CountNothing::class
            ),
        ];
    }
}
