<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\TokenType;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\UnparsedCommand;
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
    public function handle(UnparsedCommand $toParse): UnparsedCommand
    {
        $cursor = $toParse->cursor();
        $toParse->draft()->assertWithinBudget($cursor->position());

        if ($cursor->isAtEnd()) {
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
            && ($cursor->isNext(1, TokenType::OpenParen) || $cursor->isNext(1, TokenType::OpenBrace));
    }
}
