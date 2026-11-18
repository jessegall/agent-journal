<?php

declare(strict_types=1);

namespace App\Domains\Concerns;

use App\Domains\Bootstrappers\RegisterShareRecords;
use App\Domains\Contracts\DomainBootstrapper;

/**
 * Boots the shareable record types a domain declares through ProvidesShareRecords.
 */
trait HasShareRecords
{
    /**
     * @return list<class-string<DomainBootstrapper>>
     */
    protected function bootstrappersHasShareRecords(): array
    {
        return [RegisterShareRecords::class];
    }
}
