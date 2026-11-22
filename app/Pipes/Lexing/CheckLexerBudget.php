<?php

declare(strict_types=1);

namespace App\Pipes\Lexing;

use App\Contracts\Bus\Pipe;
use App\Support\Syntax\LexerCursor;

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
