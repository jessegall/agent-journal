<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Enums\TokenType;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Syntax\TreeDraft;

/**
 * The commands of a shell pipeline read so far, in order.
 */
final readonly class PipedCommands
{
    /**
     * @param  non-empty-list<int>  $commands
     */
    public function __construct(public PipedCommandsToParse $start, public array $commands) {}

    public function with(int $command): self
    {
        return new self($this->start, [...$this->commands, $command]);
    }

    public function cursor(): TokenCursor
    {
        return $this->start->toParse->cursor();
    }

    public function draft(): TreeDraft
    {
        return $this->start->toParse->draft();
    }

    /**
     * The next command of the pipeline, at the cursor.
     */
    public function command(): CommandToParse
    {
        return $this->start->toParse->command();
    }

    public function isAtPipeSymbol(): bool
    {
        $cursor = $this->cursor();

        return $cursor->is(TokenType::Pipe) || $cursor->is(TokenType::PipeBoth);
    }
}
