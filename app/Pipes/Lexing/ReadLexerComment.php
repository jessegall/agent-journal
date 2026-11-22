<?php

declare(strict_types=1);

namespace App\Pipes\Lexing;

use App\Contracts\Pipe;
use App\Enums\TokenType;
use App\Support\Syntax\LexerCursor;

/**
 * Emits a comment up to the newline or end of source.
 */
final readonly class ReadLexerComment implements Pipe
{
    public function handle(LexerCursor $cursor): LexerCursor
    {
        $newline = strpos($cursor->source, "\n", $cursor->position);
        $end = $newline === false ? strlen($cursor->source) : $newline;
        $cursor->emit(TokenType::Comment, $cursor->position, $end);
        $cursor->position = $end;

        return $cursor;
    }
}
