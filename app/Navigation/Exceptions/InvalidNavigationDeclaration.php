<?php

declare(strict_types=1);

namespace App\Navigation\Exceptions;

use App\Exceptions\ClientDeclarationError;

/**
 * A navigation item that the application refuses to start with.
 */
final class InvalidNavigationDeclaration extends ClientDeclarationError
{
    public static function nothingToOpen(string $label): self
    {
        return new self("Navigation item {$label} needs a page, child items or a children resolver.");
    }

    public static function valuesNotStrings(string $label, string $parameterType): self
    {
        return new self(
            "Navigation item {$label} must give its {$parameterType} values as a map of strings to strings.",
        );
    }

    public static function pageMissing(string $label, string $page): self
    {
        return new self(
            "Navigation item {$label} opens the page {$page}, which its domain does not declare.",
        );
    }

    public static function routeValuesMismatch(string $label, string $page, string $path): self
    {
        return new self(
            sprintf(
                "Navigation item %s must give a route value for exactly each parameter of the path '%s' of page %s.",
                $label,
                $path,
                $page,
            ),
        );
    }

    public static function groupMissing(string $label, string $group): self
    {
        return new self(
            "Navigation item {$label} joins the sidebar group {$group}, which no installed domain declares.",
        );
    }

    public static function rootOnlyOnChild(string $label, string $child): self
    {
        return new self(
            "Navigation item {$label} has the child {$child} with a group or at the foot;"
            .' only a root item has either.',
        );
    }
}
