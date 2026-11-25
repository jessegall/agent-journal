<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Values\AgentText;
use App\Values\CommandRule;
use LogicException;

/**
 * Two declared command rules cannot both hold; start-up stops and names both owners, since no priority, file order
 * or wildcard may decide between them.
 */
final class CommandRuleConflict extends LogicException
{
    private function __construct(public readonly AgentText $reason)
    {
        parent::__construct($reason->key);
    }

    public static function sameId(CommandRule $first, CommandRule $second): self
    {
        return new self(AgentText::of('core.shell.rule_declared_twice', [
            'rule' => $first->id,
            'first' => $first->scope->name(),
            'second' => $second->scope->name(),
        ]));
    }

    public static function overlapping(CommandRule $first, CommandRule $second): self
    {
        return new self(AgentText::of('core.shell.rules_overlap', [
            'first' => $first->id,
            'first_scope' => $first->scope->name(),
            'second' => $second->id,
            'second_scope' => $second->scope->name(),
            'words' => implode(' ', [
                $first->program->family,
                ...$first->subcommands,
            ]),
        ]));
    }
}
