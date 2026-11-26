<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\TokenType;
use App\Processes\Grammar\UnparsedNode;
use App\Processes\Grammar\UnparsedPipedCommands;

/**
 * Steps past the ! that negates a shell pipeline, and notes where it stood.
 */
final readonly class NoteNegation implements Pipe
{
    public function handle(UnparsedNode $toParse): UnparsedPipedCommands
    {
        $cursor = $toParse->cursor();

        if (! $cursor->is(TokenType::Bang)) {
            return new UnparsedPipedCommands($toParse, null);
        }

        $start = $cursor->position();
        $cursor->advance();

        return new UnparsedPipedCommands($toParse, $start);
    }
}
