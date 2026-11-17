<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

/**
 * A declared Vue component that is not a file under its own domain's Resources/js.
 */
final class UiComponentMissing extends DomainDeclarationError
{
    public static function outsideOwner(string $declaration, string $component): self
    {
        return new self("{$declaration} names the component '{$component}'; name a .vue file by its path under the domain's own Resources/js.");
    }

    public static function at(string $declaration, string $path): self
    {
        return new self("{$declaration} names the component {$path}, which does not exist.");
    }
}
