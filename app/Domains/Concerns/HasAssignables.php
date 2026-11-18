<?php

declare(strict_types=1);

namespace App\Domains\Concerns;

use App\Domains\Bootstrappers\RegisterAssignables;
use App\Domains\Contracts\DomainBootstrapper;

/**
 * Boots the records actors may hold, or actor types that hold records a domain declares through its capability interface.
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
