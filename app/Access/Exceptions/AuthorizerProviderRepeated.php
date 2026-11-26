<?php

declare(strict_types=1);

namespace App\Access\Exceptions;

use LogicException;

final class AuthorizerProviderRepeated extends LogicException
{
    public static function forType(string $type): self
    {
        return new self("The actor type {$type} already has an authorizer provider.");
    }
}
