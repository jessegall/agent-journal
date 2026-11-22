<?php

declare(strict_types=1);

namespace App\Pipes\Lexing;

use App\Contracts\Bus\Pipe;
use App\Support\Syntax\LexerCursor;
use App\Support\Syntax\ShellWordScanner;

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
