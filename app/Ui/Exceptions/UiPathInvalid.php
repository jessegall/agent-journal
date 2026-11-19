<?php

declare(strict_types=1);

namespace App\Ui\Exceptions;

/**
 * A declared page or action path that is not normalised.
 */
final class UiPathInvalid extends UiDeclarationError
{
    public static function notNormalised(string $declaration, string $path): self
    {
        return new self(
            "{$declaration} declares the path '{$path}'; write lower-case segments or {name} parameters joined by single slashes, with no slash at either end.",
        );
    }

    public static function parameterTwice(string $declaration, string $path): self
    {
        return new self("{$declaration} declares the path '{$path}', which names one route parameter twice.");
    }
}
