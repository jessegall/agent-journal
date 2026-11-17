<?php

declare(strict_types=1);

namespace App\Domain\Web\Exceptions;

use App\Domain\Exceptions\DomainDeclarationError;

/**
 * A domain prefix the declared routes cannot take because something else already answers under it.
 */
final class UiPrefixUnavailable extends DomainDeclarationError
{
    public static function usedByRoute(string $prefix, string $uri): self
    {
        return new self("The domain prefix /{$prefix} is already used by the route /{$uri}; rename the domain or move that route.");
    }

    public static function usedByPublicFile(string $prefix): self
    {
        return new self("The domain prefix /{$prefix} is already a file or folder in public; rename the domain or move that file.");
    }
}
