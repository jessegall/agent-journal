<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use LogicException;

final class ReadEntitlementMissing extends LogicException
{
    public static function for(string $name): self
    {
        return new self("No entitlement is declared for the read {$name}.");
    }
}
