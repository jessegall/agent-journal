<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Processes\Enums\AnalysisLimit;
use RuntimeException;

/**
 * Lexing stopped: the line holds an unfinished construct or ran past a limit. The lexer turns it into a diagnostic.
 */
final class ShellLineUnreadable extends RuntimeException
{
    private function __construct(string $reason, public readonly int $position, public readonly bool $isLimit)
    {
        parent::__construct($reason);
    }

    public static function unfinished(string $what, int $position): self
    {
        return new self("The line ends inside {$what}.", $position, false);
    }

    public static function badSubstitution(int $position): self
    {
        return new self('A parameter expansion names no parameter.', $position, false);
    }

    public static function pastLimit(AnalysisLimit $limit, int $position): self
    {
        return new self("The line is past the analysis limit of {$limit->label()}.", $position, true);
    }
}
