<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * A menu item that the application refuses to start with.
 */
final class InvalidMenuDeclaration extends UiDeclarationError
{
    public static function menuMissing(string $owner, string $item, string $menu): self
    {
        return new self("{$owner}'s menu item {$item} joins the menu {$menu}, which no installed domain declares.");
    }

    public static function targetMissing(string $item, string $target): self
    {
        return new self("Menu item {$item} targets {$target}, which its domain does not declare.");
    }

    public static function contextMismatch(string $item, string $menu, string $path): self
    {
        return new self(
            "Menu item {$item} targets the path '{$path}', whose parameters are not exactly the record of menu {$menu}.",
        );
    }
}
