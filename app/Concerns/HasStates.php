<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Contracts\DomainBootstrapper;
use App\Support\Bootstrappers\RegisterStates;

/**
 * Boots the agent states a domain declares through its capability interface.
 */
trait HasStates
{
    /**
     * @return list<class-string<DomainBootstrapper>>
     */
    protected function bootstrappersHasStates(): array
    {
        return [RegisterStates::class];
    }
}
