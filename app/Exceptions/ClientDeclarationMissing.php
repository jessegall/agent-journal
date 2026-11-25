<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * A full key asked of the client declarations that no installed domain declares, such as a key of a stale route cache.
 */
final class ClientDeclarationMissing extends ClientDeclarationError
{
    public static function for(string $key): self
    {
        return new self("No installed domain declares {$key}; clear the route cache after a domain is removed.");
    }
}
