<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes\Lexing;

use App\Bus\Contracts\Pipe;
use App\Processes\Grammar\Syntax\LexerCursor;

/**
 * Checks the scan budget before reading the next token or separator.
 */
final readonly class CheckLexerBudget implements Pipe
{
    public function handle(LexerCursor $cursor): LexerCursor
    {
        $cursor->assertWithinBudget();

        return $cursor;
    }
}
