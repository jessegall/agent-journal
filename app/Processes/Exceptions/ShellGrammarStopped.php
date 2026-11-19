<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Processes\Enums\AnalysisLimit;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Syntax\LexedLine;
use App\Processes\Values\TreeDiagnostic;
use RuntimeException;

/**
 * Building a tree stopped: invalid syntax or a limit, with the byte position. The grammar turns it into a diagnostic.
 */
final class ShellGrammarStopped extends RuntimeException
{
    private function __construct(string $reason, public readonly int $position, public readonly ParseOutcome $outcome)
    {
        parent::__construct($reason);
    }

    public static function invalid(string $reason, int $position): self
    {
        return new self($reason, $position, ParseOutcome::Invalid);
    }

    /**
     * The lexer could not read a source: its own reason and outcome, a size or time limit or invalid text, at the byte
     * in the whole line.
     */
    public static function fromLexedLine(LexedLine $lexed, int $offset): self
    {
        $diagnostic = $lexed->diagnostic ?? new TreeDiagnostic(0, 'The line cannot be read.');

        return new self($diagnostic->reason, $offset + $diagnostic->position, $lexed->outcome);
    }

    public static function pastLimit(AnalysisLimit $limit, int $position): self
    {
        return new self(
            "The line is past the analysis limit of {$limit->label()}.",
            $position,
            ParseOutcome::LimitExceeded,
        );
    }
}
