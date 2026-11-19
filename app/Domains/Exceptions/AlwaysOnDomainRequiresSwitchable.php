<?php

declare(strict_types=1);

namespace App\Domains\Exceptions;

final class AlwaysOnDomainRequiresSwitchable extends DomainDeclarationError
{
    public static function for(string $domainName, string $requiredName): self
    {
        return new self(
            sprintf(
                '%s can never be switched off but requires %s, which can; switching %s off would leave %s without it.',
                $domainName,
                $requiredName,
                $requiredName,
                $domainName,
            ),
        );
    }
}
