<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Enums\NodeType;
use App\Enums\TokenType;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\ListItem;
use App\Support\Grammar\ListItems;
use App\Support\Grammar\ListToParse;
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

    private function runInBackground(ListToParse $toParse, int $parsedCommand): void
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
        return $cursor->atEnd()
            || $cursor->is(TokenType::Newline)
            || $cursor->is(TokenType::Semicolon)
            || $cursor->is(TokenType::Comment)
            || $cursor->is(TokenType::CloseParen)
            || $cursor->is(TokenType::CloseBrace);
    }
}
