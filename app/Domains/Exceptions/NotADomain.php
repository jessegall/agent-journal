<?php

declare(strict_types=1);

namespace App\Domains\Exceptions;

use App\Domains\Support\Domain;

final class NotADomain extends DomainDeclarationError
{
    public static function for(string $className): self
    {
        return new self("{$className} does not extend ".Domain::class.'.');
    }
}
