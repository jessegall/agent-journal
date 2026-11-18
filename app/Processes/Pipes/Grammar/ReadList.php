<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Support\Pipelines;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Pipelines\ReadAndOrPipeline;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\Grammar\ListRead;
use App\Processes\Values\Grammar\ListReading;
use App\Processes\Values\Grammar\NodeRead;

/**
 * list := and_or ((; | & | newline) and_or)*, up to the closing token of a subshell or group, or the end.
 */
final readonly class ReadList implements Pipe
{
    public function __construct(private Pipelines $pipelines) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(ListReading $reading): ListRead
    {
        $cursor = $reading->cursor();
        $mayTakeSemicolon = false;
        while (true) {
            $this->readSemicolon($cursor, $mayTakeSemicolon);
            $cursor->skip(TokenType::Newline, TokenType::Comment);
            if ($reading->isAtItsEnd()) {
                return new ListRead($reading->parent);
            }
            $mayTakeSemicolon = $this->readItem($reading);
        }
    }

    /**
     * Steps past the ; that ends a command; a ;; or a ; where a command should be makes the line invalid.
     *
     * @throws ShellGrammarStopped
     */
    private function readSemicolon(TokenCursor $cursor, bool $mayTakeSemicolon): void
    {
        if (! $cursor->is(TokenType::Semicolon)) {
            return;
        }
        if ($cursor->peekIs(1, TokenType::Semicolon)) {
            throw ShellGrammarStopped::invalid('A case terminator ;; stands outside a case.', $cursor->position());
        }
        if (! $mayTakeSemicolon) {
            throw ShellGrammarStopped::invalid('A ; stands where a command should be.', $cursor->position());
        }
        $cursor->advance();
    }

    /**
     * Reads one and-or chain into the list, in the background when a & follows it, and returns whether a ; may follow.
     *
     * @throws ShellGrammarStopped
     */
    private function readItem(ListReading $reading): bool
    {
        $cursor = $reading->cursor();
        $item = $this->pipelines->run(ReadAndOrPipeline::class, $reading->andOr(), NodeRead::class)->node;
        if ($cursor->is(TokenType::Background)) {
            $this->runInBackground($reading, $item);

            return false;
        }
        $reading->draft()->adopt($reading->parent, $item);
        if (! $this->endsCommand($cursor)) {
            $unexpected = $cursor->currentType()->value;

            throw ShellGrammarStopped::invalid("Unexpected {$unexpected} after a command.", $cursor->position());
        }

        return true;
    }

    private function runInBackground(ListReading $reading, int $item): void
    {
        $draft = $reading->draft();
        $cursor = $reading->cursor();
        $range = $draft->rangeTo($item, $cursor->currentEnd());
        $background = $draft->add(NodeType::Background, $range, $reading->parent);
        $draft->adopt($background, $item);
        $cursor->advance();
    }

    private function endsCommand(TokenCursor $cursor): bool
    {
        return $cursor->atEnd()
            || $cursor->is(TokenType::Newline)
            || $cursor->is(TokenType::Semicolon)
            || $cursor->is(TokenType::Comment)
            || $cursor->is(TokenType::CloseParen)
            || $cursor->is(TokenType::CloseBrace);
    }
}
