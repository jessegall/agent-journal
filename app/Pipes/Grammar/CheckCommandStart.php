<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Enums\TokenType;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\CommandToParse;
use App\Support\Syntax\TokenCursor;
use App\Values\AgentText;

/**
 * Checks the time budget before a command, refuses a missing one, and steps past 'time' before a subshell or group.
 */
final readonly class CheckCommandStart implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(CommandToParse $toParse): CommandToParse
    {
        $cursor = $toParse->cursor();
        $toParse->draft()->assertWithinBudget($cursor->position());

        if ($cursor->atEnd()) {
            throw ShellGrammarStopped::invalid(AgentText::of('core.shell.command_missing_at_end'), $cursor->position());
        }

        if ($this->timesCompound($cursor)) {
            $cursor->advance();
        }

        return $toParse;
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
