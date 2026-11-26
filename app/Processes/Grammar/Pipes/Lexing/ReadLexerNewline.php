<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes\Lexing;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\TokenType;
use App\Processes\Grammar\Syntax\LexerCursor;

/**
 * Emits the newline and reads the here-documents named on that line.
 */
final readonly class ReadLexerNewline implements Pipe
{
    public function __construct(private ReadHereDocumentBodies $documents) {}

    public function handle(LexerCursor $cursor): LexerCursor
    {
        $cursor->emit(TokenType::Newline, $cursor->position, $cursor->position + 1);
        $cursor->position++;

        return $this->documents->handle($cursor);
    }
}
