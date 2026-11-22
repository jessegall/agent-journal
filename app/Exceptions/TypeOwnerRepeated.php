<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * Two page owners claim one class's TypeScript type, or one owner claims two types of the same name.
 */
final class TypeOwnerRepeated extends LogicException
{
    public static function forClass(string $className, string $owner, string $otherOwner): self
    {
        return new self("The type {$className} is claimed by both {$owner} and {$otherOwner}; one page owner names it.");
    }

    public static function forSymbol(string $symbol, string $owner): self
    {
        return new self("The page owner {$owner} names two types called {$symbol}, which would be one symbol in its module.");
    }
}
