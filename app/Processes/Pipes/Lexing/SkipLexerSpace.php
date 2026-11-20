<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Lexing;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Syntax\LexerCursor;

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
