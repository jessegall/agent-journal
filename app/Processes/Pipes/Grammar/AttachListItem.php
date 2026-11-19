<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\Grammar\ListItem;
use App\Processes\Values\Grammar\ListItems;
use App\Processes\Values\Grammar\ListReading;

/**
 * Places a read item in its list, in the background when a & follows it; only a command's end may follow it, and only
 * an item not sent to the background may be followed by a ;.
 */
final readonly class AttachListItem implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(ListItem $item): ListItems
    {
        $reading = $item->reading;
        $cursor = $reading->cursor();
        if ($cursor->is(TokenType::Background)) {
            $this->runInBackground($reading, $item->node);

            return new ListItems($reading, false);
        }
        $reading->draft()->adopt($reading->parent, $item->node);
        if (! $this->endsCommand($cursor)) {
            $unexpected = $cursor->currentType()->value;

            throw ShellGrammarStopped::invalid("Unexpected {$unexpected} after a command.", $cursor->position());
        }

        return new ListItems($reading, true);
    }

    private function runInBackground(ListReading $reading, int $item): void
    {
        $draft = $reading->draft();
        $cursor = $reading->cursor();
        $range = $draft->rangeTo($item, $cursor->currentEnd());
        $background = $draft->add(NodeType::Background, $range, $reading->parent);
        $draft->adopt($background, $item);
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
