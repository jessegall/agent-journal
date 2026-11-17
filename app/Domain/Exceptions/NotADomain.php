<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

use App\Domain\Contracts\Domain;

final class NotADomain extends DomainDeclarationError
{
    public static function for(string $className): self
    {
        return new self("{$className} does not implement ".Domain::class.'.');
    }
}
