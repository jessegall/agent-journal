<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

/**
 * A full key asked of the UI declarations that no installed domain declares, such as a key of a stale route cache.
 */
final class UiDeclarationMissing extends DomainDeclarationError
{
    public static function for(string $key): self
    {
        return new self("No installed domain declares {$key}; clear the route cache after a domain is removed.");
    }
}
