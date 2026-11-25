<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Values\AgentText;
use RuntimeException;

/**
 * A command line cannot become an execution plan: it was not read completely, a part is not known, or a node or word
 * can only be known when it runs. There is no whole-line fallback.
 */
final class ExecutionPlanRefused extends RuntimeException
{
    private function __construct(public readonly AgentText $reason)
    {
        parent::__construct($reason->key);
    }

    public static function incomplete(): self
    {
        return new self(AgentText::of('core.shell.plan_incomplete'));
    }

    public static function unknown(): self
    {
        return new self(AgentText::of('core.shell.plan_unknown_part'));
    }

    public static function unsupportedNode(string $type, int $node): self
    {
        return new self(AgentText::of('core.shell.plan_unsupported_node', [
            'type' => $type,
            'node' => $node,
        ]));
    }

    public static function dynamicWord(int $node): self
    {
        return new self(AgentText::of('core.shell.plan_dynamic_word', ['node' => $node]));
    }
}
