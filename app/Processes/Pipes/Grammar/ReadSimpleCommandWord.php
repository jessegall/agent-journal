<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadWordPipeline;
use App\Processes\Values\Grammar\SimpleCommandReading;
use App\Processes\Values\Grammar\WordReading;

/**
 * Reads a word of a simple command through the word pipeline; a word that starts an array assignment turns the
 * whole command into one, and is left at the cursor.
 *
 * @extends PipelineAdapter<SimpleCommandReading, WordReading>
 */
final readonly class ReadSimpleCommandWord extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadWordPipeline::class;
    }

    protected function produces(): string
    {
        return WordReading::class;
    }

    protected function into(object $input): WordReading
    {
        $word = $input->reading->cursor()->word('A word is missing.');

        return $input->reading->word($word, $input->parts->node, ! $input->parts->hasArguments());
    }

    protected function back(object $result, object $input): SimpleCommandReading
    {
        if ($result->isArrayAssignment()) {
            return $input->asArrayAssignment();
        }
        $input->reading->cursor()->advance();

        return $input->withWord($result);
    }
}
