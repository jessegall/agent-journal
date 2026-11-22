<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Pipe;
use App\Enums\TokenType;
use App\Support\Grammar\NodeToParse;
use App\Support\Grammar\PipedCommandsToParse;

/**
 * Steps past the ! that negates a shell pipeline, and notes where it stood.
 */
final readonly class NoteNegation implements Pipe
{
    public function handle(NodeToParse $toParse): PipedCommandsToParse
    {
        $cursor = $toParse->cursor();

        if (! $cursor->is(TokenType::Bang)) {
            return new PipedCommandsToParse($toParse, null);
        }

        $start = $cursor->position();
        $cursor->advance();

        return new PipedCommandsToParse($toParse, $start);
    }
}
