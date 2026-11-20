<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Lexing;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Syntax\LexerCursor;

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
