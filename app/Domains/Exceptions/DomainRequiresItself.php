<?php

declare(strict_types=1);

namespace App\Domains\Exceptions;

final class DomainRequiresItself extends DomainDeclarationError
{
    public static function for(string $name): self
    {
        return new self("{$name} requires itself; a domain always uses its own code.");
    }
}
