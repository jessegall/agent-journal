<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

/**
 * Two registered domains share a namespace or a folder, so a class could not be given to one owner.
 */
final class AmbiguousDomainRoot extends DomainDeclarationError
{
    public static function between(string $first, string $second): self
    {
        return new self("{$first} and {$second} overlap: one lies inside the other's namespace or folder.");
    }
}
