<?php

declare(strict_types=1);

namespace App\Web\Contracts;

use App\Ui\Declarations\DomainUi;

/**
 * What other Core areas use of the Web area's UiOwnerAvailability.
 */
interface UiOwnerAvailability
{
    public function isAvailable(DomainUi $owner): bool;
}
