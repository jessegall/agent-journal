<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Contracts\DomainBootstrapper;
use App\Support\Bootstrappers\RegisterIncomingWork;

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
        return [RegisterIncomingWork::class];
    }
}
