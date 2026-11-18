<?php

declare(strict_types=1);

namespace App\Domains\Exceptions;

final class RequiredDomainMissing extends DomainDeclarationError
{
    public static function for(string $domainName, string $requiredName): self
    {
        return new self("{$domainName} requires {$requiredName}, which is not in bootstrap/domains.php.");
    }
}
