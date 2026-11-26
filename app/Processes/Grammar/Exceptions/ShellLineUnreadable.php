<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Exceptions;

use App\CommandRules\Enums\AnalysisLimit;
use App\Values\AgentText;
use RuntimeException;

/**
 * Lexing stopped: the line holds an unfinished construct or ran past a limit. The lexer turns it into a diagnostic.
 */
final class ShellLineUnreadable extends RuntimeException
{
    private function __construct(
        public readonly AgentText $reason,
        public readonly int $position,
        public readonly bool $isLimit,
    ) {
        parent::__construct($reason->key);
    }

    public static function unfinished(string $what, int $position): self
    {
        return new self(AgentText::of('core.shell.ends_inside', ['what' => $what]), $position, false);
    }

    public static function badSubstitution(int $position): self
    {
        return new self(AgentText::of('core.shell.expansion_without_name'), $position, false);
    }

    public static function pastLimit(AnalysisLimit $limit, int $position): self
    {
        return new self(AgentText::of('core.shell.past_limit', ['limit' => $limit->label()]), $position, true);
    }
}
