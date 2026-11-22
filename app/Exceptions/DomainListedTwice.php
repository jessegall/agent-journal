<?php

declare(strict_types=1);

namespace App\Exceptions;

final class DomainListedTwice extends DomainDeclarationError
{
    public static function for(string $name): self
    {
        return new self("{$name} is listed twice in bootstrap/domains.php.");
    }
}
