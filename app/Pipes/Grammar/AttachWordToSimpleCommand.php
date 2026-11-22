<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadWordPipeline;
use App\Support\Grammar\SimpleCommandDraft;
use App\Support\Grammar\WordToParse;
use App\Support\PipelineAdapter;

/**
 * Reads a word of a simple command through the word pipeline; a word that starts an array assignment turns the
 * whole command into one, and is left at the cursor.
 *
 * @extends PipelineAdapter<SimpleCommandDraft, WordToParse>
 */
final readonly class AttachWordToSimpleCommand extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadWordPipeline::class;
    }

    protected function produces(): string
    {
        return WordToParse::class;
    }

    protected function into(object $input): WordToParse
    {
        $word = $input->toParse->cursor()->word('A word is missing.');

        return $input->toParse->word($word, $input->parts->node, ! $input->parts->hasArguments());
    }

    protected function back(object $parsedWord, object $input): SimpleCommandDraft
    {
        if ($parsedWord->isArrayAssignment()) {
            return $input->asArrayAssignment();
        }

        $input->toParse->cursor()->advance();

        return $input->withWord($parsedWord);
    }
}
