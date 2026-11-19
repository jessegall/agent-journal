<?php

declare(strict_types=1);

namespace App\Ui\Exceptions;

/**
 * A declared key that is not a local key of its domain.
 */
final class UiKeyInvalid extends UiDeclarationError
{
    public static function notLocal(string $owner, string $type, string $key): self
    {
        return new self(
            "{$owner} declares the {$type} key '{$key}'; a key is lower-case words joined by dashes, without the "
                ."domain's name, which is added for it.",
        );
    }
}
