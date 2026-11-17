<?php

declare(strict_types=1);

namespace App\Core\Ui\Exceptions;

/**
 * Two declarations that share a key, or whose browser prop names come out the same.
 */
final class UiKeyRepeated extends UiDeclarationError
{
    public static function inDomain(string $owner, string $type, string $key): self
    {
        return new self("{$owner} declares the {$type} key '{$key}' twice.");
    }

    public static function propName(string $propName, string $first, string $second): self
    {
        return new self("{$first} and {$second} both come out as the browser prop {$propName}; rename one of them.");
    }
}
