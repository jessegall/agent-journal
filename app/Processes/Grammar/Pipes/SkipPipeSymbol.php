<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\TokenType;
use App\Processes\Grammar\PipedCommands;

/**
 * Steps past the | or |& between two commands, and the newlines and comments after it.
 */
final readonly class SkipPipeSymbol implements Pipe
{
    public function handle(PipedCommands $commands): PipedCommands
    {
        $cursor = $commands->cursor();
        $cursor->advance();
        $cursor->skip(TokenType::Newline, TokenType::Comment);

        return $commands;
    }
}
