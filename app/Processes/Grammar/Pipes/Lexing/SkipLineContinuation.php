<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes\Lexing;

use App\Bus\Contracts\Pipe;
use App\Processes\Grammar\Syntax\LexerCursor;

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
