<?php

declare(strict_types=1);

namespace App\Contracts\Navigation;

use App\Declarations\DomainUi;

/**
 * What other Core areas use of the Web area's UiOwnerAvailability.
 */
interface UiOwnerAvailability
{
    /**
     * Whether the domain that owns the screens is switched on, so its pages show.
     */
    public function isAvailable(DomainUi $owner): bool;
}
