<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\TokenType;
use App\Processes\Values\Grammar\NodeToParse;
use App\Processes\Values\Grammar\PipedCommandsToParse;

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
