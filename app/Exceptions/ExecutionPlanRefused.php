<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A command line cannot become an execution plan: it was not read completely, a part is not known, or a node or word
 * can only be known when it runs. There is no whole-line fallback.
 */
final class ExecutionPlanRefused extends RuntimeException
{
    public static function incomplete(): self
    {
        return new self('Only a completely read command line can be planned.');
    }

    public static function unknown(): self
    {
        return new self('A command line with an unknown part cannot be planned.');
    }

    public static function unsupportedNode(string $type, int $node): self
    {
        return new self("The {$type} node {$node} cannot be planned.");
    }

    public static function dynamicWord(int $node): self
    {
        return new self("A word of node {$node} is only known when it runs.");
    }
}
