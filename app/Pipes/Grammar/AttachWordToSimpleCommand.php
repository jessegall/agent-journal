<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadWordPipeline;
use App\Support\Grammar\SimpleCommandDraft;
use App\Support\Grammar\UnparsedWord;
use App\Support\PipelineAdapter;
use App\Values\AgentText;

/**
 * Reads a word of a simple command through the word pipeline; a word that starts an array assignment turns the
 * whole command into one, and is left at the cursor.
 *
 * @extends PipelineAdapter<SimpleCommandDraft, UnparsedWord>
 */
final readonly class AttachWordToSimpleCommand extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadWordPipeline::class;
    }

    protected function produces(): string
    {
        return UnparsedWord::class;
    }

    protected function into(object $input): UnparsedWord
    {
        $word = $input->toParse->cursor()->word(AgentText::of('core.shell.word_missing'));

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
