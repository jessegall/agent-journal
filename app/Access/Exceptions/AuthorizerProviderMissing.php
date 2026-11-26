<?php

declare(strict_types=1);

namespace App\Access\Exceptions;

use LogicException;

final class AuthorizerProviderMissing extends LogicException
{
    public static function forType(string $type): self
    {
        return new self("The actor type {$type} has no authorizer provider.");
    }
}
