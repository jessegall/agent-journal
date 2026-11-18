<?php

declare(strict_types=1);

namespace App\Domains\Concerns;

use App\Domains\Bootstrappers\RegisterNumberedModels;
use App\Domains\Contracts\DomainBootstrapper;

/**
 * Boots the numbered models a domain declares through its capability interface.
 */
trait HasNumberedModels
{
    /**
     * @return list<class-string<DomainBootstrapper>>
     */
    protected function bootstrappersHasNumberedModels(): array
    {
        return [RegisterNumberedModels::class];
    }
}
