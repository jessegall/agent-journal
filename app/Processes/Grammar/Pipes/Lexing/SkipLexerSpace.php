<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes\Lexing;

use App\Bus\Contracts\Pipe;
use App\Processes\Grammar\Syntax\LexerCursor;

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
