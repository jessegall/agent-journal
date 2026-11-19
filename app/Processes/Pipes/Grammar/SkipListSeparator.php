<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\Grammar\ListItems;

/**
 * Steps past the ; that ends a list item and the newlines and comments after it; a ;; or a ; where a command should be
 * makes the line invalid.
 */
final readonly class SkipListSeparator implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(ListItems $items): ListItems
    {
        $cursor = $items->reading->cursor();
        if ($cursor->is(TokenType::Semicolon)) {
            $this->stepPastSemicolon($cursor, $items->mayTakeSemicolon);
        }
        $cursor->skip(TokenType::Newline, TokenType::Comment);

        return $items;
    }

    /**
     * @throws ShellGrammarStopped
     */
    private function stepPastSemicolon(TokenCursor $cursor, bool $mayTakeSemicolon): void
    {
        if ($cursor->peekIs(1, TokenType::Semicolon)) {
            throw ShellGrammarStopped::invalid('A case terminator ;; stands outside a case.', $cursor->position());
        }
        if (! $mayTakeSemicolon) {
            throw ShellGrammarStopped::invalid('A ; stands where a command should be.', $cursor->position());
        }
        $cursor->advance();
    }
}
