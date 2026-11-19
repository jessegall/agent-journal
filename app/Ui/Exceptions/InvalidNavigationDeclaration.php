<?php

declare(strict_types=1);

namespace App\Ui\Exceptions;

/**
 * A navigation item that the application refuses to start with.
 */
final class InvalidNavigationDeclaration extends UiDeclarationError
{
    public static function nothingToOpen(string $item): self
    {
        return new self("Navigation item {$item} needs a page, child items or a children resolver.");
    }

    public static function valuesNotStrings(string $item, string $values): self
    {
        return new self("Navigation item {$item} must give its {$values} values as a map of strings to strings.");
    }

    public static function pageMissing(string $item, string $page): self
    {
        return new self("Navigation item {$item} opens the page {$page}, which its domain does not declare.");
    }

    public static function routeValuesMismatch(string $item, string $page, string $path): self
    {
        return new self(
            "Navigation item {$item} must give a route value for exactly each parameter of the path '{$path}' of page {$page}.",
        );
    }

    public static function rootOnlyOnChild(string $item, string $child): self
    {
        return new self(
            "Navigation item {$item} has the child {$child} with a group or at the foot; only a root item has either.",
        );
    }
}
