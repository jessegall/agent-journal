<?php

declare(strict_types=1);

namespace App\Contracts\Domains;

/**
 * Whether an owner's features run now: Core and a domain that can never be switched off always do; a domain that can
 * be switched off does while its switch is on and every domain it requires is available too.
 */
interface DomainAvailability
{
    /**
     * Whether the domain of that owner is switched on.
     */
    public function isEnabled(string $owner): bool;
}
