<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Enums\TokenType;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\ListItems;
use App\Support\Syntax\TokenCursor;

/**
 * Steps past the ; that ends a list item and the newlines and comments after it; a ;; or a ; where a command should be
 * makes the line invalid.
 */
final readonly class SkipListSeparator implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(ListItems $listCursor): ListItems
    {
        $cursor = $listCursor->toParse->cursor();

        if ($cursor->is(TokenType::Semicolon)) {
            $this->stepPastSemicolon($cursor, $listCursor->mayTakeSemicolon);
        }

        $cursor->skip(TokenType::Newline, TokenType::Comment);

        return $listCursor;
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
