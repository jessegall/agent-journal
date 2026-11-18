<?php

declare(strict_types=1);

namespace App\Domains\Concerns;

use App\Domains\Bootstrappers\RegisterShareGateways;
use App\Domains\Contracts\DomainBootstrapper;

/**
 * Boots the share gateways a domain declares through ProvidesShareGateways.
 */
trait HasShareGateways
{
    /**
     * @return list<class-string<DomainBootstrapper>>
     */
    protected function bootstrappersHasShareGateways(): array
    {
        return [RegisterShareGateways::class];
    }
}
