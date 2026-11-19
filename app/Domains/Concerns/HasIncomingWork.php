<?php

declare(strict_types=1);

namespace App\Domains\Concerns;

use App\Domains\Bootstrappers\RegisterIncomingWork;
use App\Domains\Contracts\DomainBootstrapper;

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
