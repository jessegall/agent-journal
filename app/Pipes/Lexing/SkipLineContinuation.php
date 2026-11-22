<?php

declare(strict_types=1);

namespace App\Pipes\Lexing;

use App\Contracts\Bus\Pipe;
use App\Support\Syntax\LexerCursor;

/**
 * Steps over the backslash and newline that continue the line.
 */
final readonly class SkipLineContinuation implements Pipe
{
    public function handle(LexerCursor $cursor): LexerCursor
    {
        $cursor->position += 2;

        return $cursor;
    }
}
