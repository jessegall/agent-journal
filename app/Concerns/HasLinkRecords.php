<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Contracts\Domains\DomainBootstrapper;
use App\Support\Bootstrappers\LinkRecordsBootstrapper;

/**
 * Boots the record providers a domain declares through LinkRecordProvider.
 */
trait HasLinkRecords
{
    /**
     * @return list<class-string<DomainBootstrapper>>
     */
    protected function bootstrappersHasLinkRecords(): array
    {
        return [LinkRecordsBootstrapper::class];
    }
}
