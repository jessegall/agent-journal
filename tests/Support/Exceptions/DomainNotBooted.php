<?php

declare(strict_types=1);

namespace Tests\Support\Exceptions;

use LogicException;

/**
 * A test loaded a class of a domain it did not boot, as a class name built at run time does, which no static import
 * check sees.
 */
final class DomainNotBooted extends LogicException
{
    public static function for(string $class, string $domain): self
    {
        return new self("{$class} belongs to the domain {$domain}, which this test does not boot: boot it or leave it.");
    }
}
