<?php

declare(strict_types=1);

namespace App\Domains\Concerns;

use App\Domains\Bootstrappers\RegisterLinkRecords;
use App\Domains\Contracts\DomainBootstrapper;

/**
 * Boots the record providers a domain declares through ProvidesLinkRecords.
 */
trait HasLinkRecords
{
    /**
     * @return list<class-string<DomainBootstrapper>>
     */
    protected function bootstrappersHasLinkRecords(): array
    {
        return [RegisterLinkRecords::class];
    }
}
