<?php

declare(strict_types=1);

namespace App\Domains\Exceptions;

final class AlwaysOnDomainRequiresSwitchable extends DomainDeclarationError
{
    public static function for(string $domainName, string $requiredName): self
    {
        return new self(
            "{$domainName} can never be switched off but requires {$requiredName}, which can; switching {$requiredName} off would leave {$domainName} without it.",
        );
    }
}
