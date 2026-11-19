<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\TokenType;
use App\Processes\Values\Grammar\NodeReading;
use App\Processes\Values\Grammar\PipedCommandsReading;

/**
 * Steps past the ! that negates a shell pipeline, and notes where it stood.
 */
final readonly class NoteNegation implements Pipe
{
    public function handle(NodeReading $reading): PipedCommandsReading
    {
        $cursor = $reading->cursor();
        if (! $cursor->is(TokenType::Bang)) {
            return new PipedCommandsReading($reading, null);
        }
        $start = $cursor->position();
        $cursor->advance();

        return new PipedCommandsReading($reading, $start);
    }
}
