<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Processes\Values\CommandRule;
use LogicException;

/**
 * Two declared command rules cannot both hold; start-up stops and names both owners, since no priority, file order
 * or wildcard may decide between them.
 */
final class CommandRuleConflict extends LogicException
{
    public static function sameId(CommandRule $first, CommandRule $second): self
    {
        return new self("The command rule {$first->id} is declared by {$first->scope->name()} and by {$second->scope->name()}.");
    }

    public static function overlapping(CommandRule $first, CommandRule $second): self
    {
        return new self("The command rules {$first->id} ({$first->scope->name()}) and {$second->id} ({$second->scope->name()}) both match {$first->program->family} ".implode(' ', $first->subcommands).' with words that overlap; make their grammars disjoint or replace one exactly.');
    }
}
