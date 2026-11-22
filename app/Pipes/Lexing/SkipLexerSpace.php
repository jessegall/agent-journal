<?php

declare(strict_types=1);

namespace App\Pipes\Lexing;

use App\Contracts\Bus\Pipe;
use App\Support\Syntax\LexerCursor;

/**
 * Steps over a horizontal separator.
 */
final readonly class SkipLexerSpace implements Pipe
{
    public function handle(LexerCursor $cursor): LexerCursor
    {
        $cursor->position++;

        return $cursor;
    }
}
