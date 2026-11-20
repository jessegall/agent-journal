<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Lexing;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\TokenType;
use App\Processes\Syntax\LexerCursor;

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
