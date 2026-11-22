<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Contracts\DomainBootstrapper;
use App\Support\Bootstrappers\RegisterAssignables;

/**
 * Boots the records actors may hold, or actor types that hold records a domain declares through its capability
 * interface.
 */
trait HasAssignables
{
    /**
     * @return list<class-string<DomainBootstrapper>>
     */
    protected function bootstrappersHasAssignables(): array
    {
        return [RegisterAssignables::class];
    }
}
