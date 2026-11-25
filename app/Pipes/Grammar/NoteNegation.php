<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Enums\CommandRules\TokenType;
use App\Support\Grammar\UnparsedNode;
use App\Support\Grammar\UnparsedPipedCommands;

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
