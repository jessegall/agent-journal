<?php

declare(strict_types=1);

namespace App\Pipes\Lexing;

use App\Contracts\Bus\Pipe;
use App\Enums\TokenType;
use App\Support\Syntax\LexerCursor;

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
