<?php

declare(strict_types=1);

namespace App\Ui\Exceptions;

/**
 * A navigation item that the application refuses to start with.
 */
final class InvalidNavigationDeclaration extends UiDeclarationError
{
    public static function nothingToOpen(string $navigationLabel): self
    {
        return new self("Navigation item {$navigationLabel} needs a page, child items or a children resolver.");
    }

    public static function valuesNotStrings(string $navigationLabel, string $parameterType): self
    {
        return new self("Navigation item {$navigationLabel} must give its {$parameterType} values as a map of strings to strings.");
    }

    public static function pageMissing(string $navigationLabel, string $page): self
    {
        return new self("Navigation item {$navigationLabel} opens the page {$page}, which its domain does not declare.");
    }

    public static function routeValuesMismatch(string $navigationLabel, string $page, string $path): self
    {
        return new self(
            sprintf(
                "Navigation item %s must give a route value for exactly each parameter of the path '%s' of page %s.",
                $navigationLabel,
                $path,
                $page,
            ),
        );
    }

    public static function rootOnlyOnChild(string $navigationLabel, string $child): self
    {
        return new self(
            "Navigation item {$navigationLabel} has the child {$child} with a group or at the foot; only a root item has either.",
        );
    }
}
