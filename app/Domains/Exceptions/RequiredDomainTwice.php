<?php

declare(strict_types=1);

namespace App\Domains\Exceptions;

final class RequiredDomainTwice extends DomainDeclarationError
{
    public static function for(string $domainName, string $requiredName): self
    {
        return new self("{$domainName} requires {$requiredName} twice.");
    }
}
