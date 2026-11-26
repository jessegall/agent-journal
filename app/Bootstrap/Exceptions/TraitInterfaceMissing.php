<?php

declare(strict_types=1);

namespace App\Bootstrap\Exceptions;

use LogicException;

/**
 * A class uses a trait that needs it to implement an interface it does not implement.
 */
final class TraitInterfaceMissing extends LogicException
{
    /**
     * @param  list<class-string>  $interfaces
     */
    public static function for(string $class, string $trait, array $interfaces): self
    {
        return new self(sprintf(
            '%s uses %s, which needs it to implement %s; implement one or drop the trait.',
            $class,
            $trait,
            implode(' or ', $interfaces),
        ));
    }
}
