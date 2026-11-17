<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

/**
 * Two declared routes of one domain that answer the same method and URLs.
 */
final class UiPathRepeated extends DomainDeclarationError
{
    public static function for(string $first, string $second, string $method, string $uri): self
    {
        return new self("{$first} and {$second} both answer {$method} /{$uri}.");
    }
}
