<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Pipelines\Support\Pipelines;
use App\Processes\Contracts\CommandReader;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\TokenType;
use App\Processes\Enums\WordPlace;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Pipelines\ReadRedirectPipeline;
use App\Processes\Pipelines\ReadWordPipeline;
use App\Processes\Stages\Grammar\CommandReading;
use App\Processes\Stages\Grammar\GrammarContext;
use App\Processes\Stages\Grammar\SimpleCommandParts;
use App\Processes\Stages\Grammar\WordReading;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Syntax\UnsupportedConstructs;
use App\Processes\Values\Redirect;
use App\Processes\Values\SourceRange;

/**
 * simple := (assignment | word | redirect)+; each word runs through the word pipeline and each redirect through the
 * redirect pipeline. A line of only redirects is still a command, with no program.
 */
final readonly class SimpleCommandReader implements CommandReader
{
    public function __construct(
        private Pipelines $pipelines,
        private UnsupportedConstructs $unsupported,
    ) {}

    /**
     * Any command no other reader takes is a simple command.
     */
    public function reads(TokenCursor $cursor): bool
    {
        return true;
    }

    public function read(CommandReading $reading): int
    {
        $cursor = $reading->cursor();
        $parts = $this->open($reading->context);
        while ($this->continues($cursor, $parts)) {
            if ($cursor->is(TokenType::Redirect)) {
                $parts = $parts->withRedirect($this->readRedirect($reading, $parts));

                continue;
            }
            $word = $this->readWord($reading, $parts);
            if ($word->place === WordPlace::ArrayAssignment) {
                return $this->giveWayToArrayAssignment($reading->context, $parts);
            }
            $parts = $parts->withWord($word);
            $cursor->advance();
        }

        return $this->finish($reading->context, $parts);
    }

    private function open(GrammarContext $context): SimpleCommandParts
    {
        $start = $context->cursor->position();
        $node = $context->draft->add(NodeType::SimpleCommand, new SourceRange($start, $start), null);
        $context->draft->countExecutablePart($start);

        return SimpleCommandParts::startAt($node, $start);
    }

    /**
     * Whether the token at the cursor still belongs to the command: a redirect or a word, and a } only after the first
     * argument.
     */
    private function continues(TokenCursor $cursor, SimpleCommandParts $parts): bool
    {
        if ($cursor->atEnd()) {
            return false;
        }

        return $cursor->is(TokenType::Redirect)
            || $cursor->is(TokenType::Word)
            || $cursor->is(TokenType::OpenBrace)
            || ($cursor->is(TokenType::CloseBrace) && $parts->hasArguments());
    }

    /**
     * @throws ShellGrammarStopped
     */
    private function readRedirect(CommandReading $reading, SimpleCommandParts $parts): Redirect
    {
        return $this->pipelines->run(ReadRedirectPipeline::class, $reading->redirect($parts->node), Redirect::class);
    }

    /**
     * @throws ShellGrammarStopped
     */
    private function readWord(CommandReading $reading, SimpleCommandParts $parts): WordReading
    {
        $word = $reading->cursor()->word('A word is missing.');
        $wordReading = $reading->word($word, $parts->node, ! $parts->hasArguments());

        return $this->pipelines->run(ReadWordPipeline::class, $wordReading, WordReading::class);
    }

    /**
     * An array assignment makes the whole command unsupported: its node gives way to one Unsupported node.
     *
     * @throws ShellGrammarStopped
     */
    private function giveWayToArrayAssignment(GrammarContext $context, SimpleCommandParts $parts): int
    {
        $context->draft->uncountExecutablePart();
        $context->draft->remove($parts->node);

        return $this->unsupported->skip($context, 'An array assignment is not supported.', null);
    }

    /**
     * @throws ShellGrammarStopped
     */
    private function finish(GrammarContext $context, SimpleCommandParts $parts): int
    {
        if ($parts->isEmpty() && ! $context->draft->hasChildren($parts->node)) {
            throw ShellGrammarStopped::invalid('A command is missing here.', $parts->start);
        }
        $context->draft->finish($parts->node, $parts->range(), $parts->arguments, $parts->redirects);

        return $parts->node;
    }
}
