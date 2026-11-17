<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

/**
 * A navigation item that the application refuses to start with.
 */
final class InvalidNavigationDeclaration extends DomainDeclarationError
{
    public static function nothingToOpen(string $item): self
    {
        return new self("Navigation item {$item} needs a page, child items or a children reader.");
    }

    public static function valuesNotStrings(string $item, string $values): self
    {
        return new self("Navigation item {$item} must give its {$values} values as a map of strings to strings.");
    }

    public static function rootOnlyOnChild(string $item, string $child): self
    {
        return new self("Navigation item {$item} has the child {$child} with a group or at the foot; only a root item has either.");
    }
}
