<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\Grammar\CommandReading;

/**
 * Checks the time budget before a command, refuses a missing one, and steps past 'time' before a subshell or group.
 */
final readonly class StartCommand implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(CommandReading $reading): CommandReading
    {
        $cursor = $reading->cursor();
        $reading->draft()->checkBudget($cursor->position());
        if ($cursor->atEnd()) {
            throw ShellGrammarStopped::invalid('A command is missing at the end of the line.', $cursor->position());
        }
        if ($this->timesCompound($cursor)) {
            $cursor->advance();
        }

        return $reading;
    }

    /**
     * Whether the cursor stands on the time keyword before a subshell or group.
     */
    private function timesCompound(TokenCursor $cursor): bool
    {
        return $cursor->currentLiteral() === 'time'
            && ($cursor->peekIs(1, TokenType::OpenParen) || $cursor->peekIs(1, TokenType::OpenBrace));
    }
}
