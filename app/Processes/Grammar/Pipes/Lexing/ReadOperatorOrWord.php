<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes\Lexing;

use App\Bus\Contracts\Pipe;
use App\Processes\Grammar\Syntax\LexerCursor;
use App\Processes\Grammar\Syntax\ShellWordScanner;

/**
 * Takes an operator if one starts here, or reads the next word.
 */
final readonly class ReadOperatorOrWord implements Pipe
{
    public function __construct(private ShellWordScanner $words) {}

    public function handle(LexerCursor $cursor): LexerCursor
    {
        if ($cursor->readOperator()) {
            return $cursor;
        }

        $this->words->read($cursor);

        return $cursor;
    }
}
