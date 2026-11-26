<?php

declare(strict_types=1);

namespace App\Bootstrap\Exceptions;

use App\Exceptions\DomainDeclarationError;

final class DomainNotFound extends DomainDeclarationError
{
    public static function for(string $name): self
    {
        return new self("{$name} is not a registered domain.");
    }
}
