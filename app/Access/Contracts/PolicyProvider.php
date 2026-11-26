<?php

declare(strict_types=1);

namespace App\Access\Contracts;

use App\Access\Values\PolicyDefinition;

/**
 * A domain whose models are decided on by its own policies, registered with Core before commands are checked.
 */
interface PolicyProvider
{
    /**
     * @return list<PolicyDefinition>
     */
    public function policies(): array;
}
