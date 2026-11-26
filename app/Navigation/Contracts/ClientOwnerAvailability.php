<?php

declare(strict_types=1);

namespace App\Navigation\Contracts;

use App\Navigation\Declarations\DomainClient;

/**
 * What other Core areas use of the Web area's ClientOwnerAvailability.
 */
interface ClientOwnerAvailability
{
    /**
     * Whether the domain that owns the screens is switched on, so its pages show.
     */
    public function isAvailable(DomainClient $owner): bool;
}
