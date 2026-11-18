<?php

declare(strict_types=1);

namespace App\Ui\Exceptions;

/**
 * A declared Vue component that is not a file in its own domain's script folder (resources/js).
 */
final class UiComponentMissing extends UiDeclarationError
{
    public static function outsideOwner(string $declaration, string $component): self
    {
        return new self("{$declaration} names the component '{$component}'; name a .vue file by its path in the domain's own script folder (resources/js).");
    }

    public static function at(string $declaration, string $path): self
    {
        return new self("{$declaration} names the component {$path}, which does not exist.");
    }
}
