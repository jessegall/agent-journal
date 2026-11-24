<?php

declare(strict_types=1);

namespace App\Contracts\Authorization;

use App\Values\ReadEntitlement;

/**
 * Every read's entitlement, declared once at boot by the module that owns the read.
 */
interface ReadEntitlements
{
    /**
     * Adds a named entitlement that read rules may require.
     */
    public function declare(string $name, ReadEntitlement $entitlement): void;

    /**
     * The read's entitlement; a read nobody declared keeps only its own resolver's checks.
     */
    public function of(string $name): ReadEntitlement;
}
