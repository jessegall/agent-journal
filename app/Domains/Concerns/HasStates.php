<?php

declare(strict_types=1);

namespace App\Domains\Concerns;

use App\Domains\Bootstrappers\RegisterStates;
use App\Domains\Contracts\DomainBootstrapper;

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
