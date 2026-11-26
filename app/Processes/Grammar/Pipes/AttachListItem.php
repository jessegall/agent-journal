<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\NodeType;
use App\CommandRules\Enums\TokenType;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\ListItem;
use App\Processes\Grammar\ListItems;
use App\Processes\Grammar\UnparsedList;
use App\Support\Syntax\TokenCursor;
use App\Values\AgentText;

/**
 * Places a read item in its list, in the background when a & follows it; only a command's end may follow it, and only
 * an item not sent to the background may be followed by a ;.
 */
final readonly class AttachListItem implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(ListItem $parsedCommand): ListItems
    {
        $toParse = $parsedCommand->toParse;
        $cursor = $toParse->cursor();

        if ($cursor->is(TokenType::Background)) {
            $this->runInBackground($toParse, $parsedCommand->node);

            return new ListItems($toParse, false);
        }

        $toParse->draft()->adopt($toParse->parent, $parsedCommand->node);

        if (! $this->endsCommand($cursor)) {
            $unexpected = $cursor->currentType()->value;

            throw ShellGrammarStopped::invalid(
                AgentText::of('core.shell.unexpected_after_command', ['token' => $unexpected]),
                $cursor->position(),
            );
        }

        return new ListItems($toParse, true);
    }

    private function runInBackground(UnparsedList $toParse, int $parsedCommand): void
    {
        $draft = $toParse->draft();
        $cursor = $toParse->cursor();
        $range = $draft->rangeTo($parsedCommand, $cursor->currentEnd());
        $background = $draft->add(NodeType::Background, $range, $toParse->parent);
        $draft->adopt($background, $parsedCommand);
        $cursor->advance();
    }

    private function endsCommand(TokenCursor $cursor): bool
    {
        return $cursor->isAtEnd()
            || $cursor->is(TokenType::Newline)
            || $cursor->is(TokenType::Semicolon)
            || $cursor->is(TokenType::Comment)
            || $cursor->is(TokenType::CloseParen)
            || $cursor->is(TokenType::CloseBrace);
    }
}
