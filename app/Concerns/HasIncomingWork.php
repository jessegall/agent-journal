<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Contracts\Domains\DomainBootstrapper;
use App\Support\Bootstrappers\IncomingWorkBootstrapper;

/**
 * Registers the domain's incoming work at boot.
 */
trait HasIncomingWork
{
    /**
     * @return list<class-string<DomainBootstrapper>>
     */
    protected function bootstrappersHasIncomingWork(): array
    {
        return [IncomingWorkBootstrapper::class];
    }
}
