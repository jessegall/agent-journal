<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\TokenType;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\ListItems;
use App\Support\Syntax\TokenCursor;
use App\Values\AgentText;

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
        if ($cursor->isNext(1, TokenType::Semicolon)) {
            throw ShellGrammarStopped::invalid(
                AgentText::of('core.shell.case_terminator_outside'),
                $cursor->position(),
            );
        }

        if (! $mayTakeSemicolon) {
            throw ShellGrammarStopped::invalid(AgentText::of('core.shell.separator_misplaced'), $cursor->position());
        }

        $cursor->advance();
    }
}
