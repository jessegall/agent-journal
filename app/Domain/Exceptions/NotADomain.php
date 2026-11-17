<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

final class NotADomain extends DomainDeclarationError
{
    public static function for(string $className): self
    {
        return new self("{$className} does not implement App\\Domain\\Domain.");
    }
}
