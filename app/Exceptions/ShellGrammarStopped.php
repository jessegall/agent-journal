<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Enums\CommandRules\AnalysisLimit;
use App\Enums\CommandRules\ParseOutcome;
use App\Support\Syntax\LexedLine;
use App\Values\AgentText;
use App\Values\TreeDiagnostic;
use RuntimeException;

/**
 * Building a tree stopped: invalid syntax or a limit, with the byte position. The grammar turns it into a diagnostic.
 */
final class ShellGrammarStopped extends RuntimeException
{
    private function __construct(
        public readonly AgentText $reason,
        public readonly int $position,
        public readonly ParseOutcome $outcome,
    ) {
        parent::__construct($reason->key);
    }

    public static function invalid(AgentText $reason, int $position): self
    {
        return new self($reason, $position, ParseOutcome::Invalid);
    }

    /**
     * The lexer could not read a source: its own reason and outcome, a size or time limit or invalid text, at the byte
     * in the whole line.
     */
    public static function fromLexedLine(LexedLine $lexed, int $offset): self
    {
        $diagnostic = $lexed->diagnostic ?? new TreeDiagnostic(0, AgentText::of('core.shell.unreadable'));

        return new self($diagnostic->reason, $offset + $diagnostic->position, $lexed->outcome);
    }

    public static function pastLimit(AnalysisLimit $limit, int $position): self
    {
        return new self(
            AgentText::of('core.shell.past_limit', ['limit' => $limit->label()]),
            $position,
            ParseOutcome::LimitExceeded,
        );
    }
}
