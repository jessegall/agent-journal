<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Lexing;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Syntax\ShellWordScanner;
use App\Processes\Syntax\LexerCursor;

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
