<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\TokenType;
use App\Processes\Values\Grammar\PipedCommands;

/**
 * Steps past the | or |& between two commands, and the newlines and comments after it.
 */
final readonly class StepPastPipeSymbol implements Pipe
{
    public function handle(PipedCommands $commands): PipedCommands
    {
        $cursor = $commands->cursor();
        $cursor->advance();
        $cursor->skip(TokenType::Newline, TokenType::Comment);

        return $commands;
    }
}
