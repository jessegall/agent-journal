<?php

declare(strict_types=1);

namespace App\Domains\Exceptions;

/**
 * A domain implements a capability interface without the trait that boots it, so its boot would register nothing.
 */
final class CapabilityWithoutTrait extends DomainDeclarationError
{
    public static function for(string $domain, string $capability, string $trait): self
    {
        return new self(
            "{$domain} implements {$capability} but does not use {$trait}, so its boot would register nothing; use the trait.",
        );
    }
}
