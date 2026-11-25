<?php

declare(strict_types=1);

namespace App\Support\Grammar;

use App\Enums\TokenType;
use App\Support\Syntax\TokenCursor;
use App\Support\Syntax\TreeDraft;

/**
 * The commands of a shell pipeline read so far, in order.
 */
final readonly class PipedCommands
{
    /**
     * @param  non-empty-list<int>  $commands
     */
    public function __construct(public UnparsedPipedCommands $start, public array $commands) {}

    public function with(int $command): self
    {
        return new self($this->start, [
            ...$this->commands,
            $command,
        ]);
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
    public function command(): UnparsedCommand
    {
        return $this->start->toParse->command();
    }

    public function isAtPipeSymbol(): bool
    {
        $cursor = $this->cursor();

        return $cursor->is(TokenType::Pipe) || $cursor->is(TokenType::PipeBoth);
    }
}
