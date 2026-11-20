<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Values\PolicyRegistration;

/**
 * A domain whose models are decided on by its own policies, registered with Core before commands are checked.
 */
interface PolicyProvider
{
    /**
     * @return list<PolicyRegistration>
     */
    public function policies(): array;
}
