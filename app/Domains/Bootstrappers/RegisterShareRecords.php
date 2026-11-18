<?php

declare(strict_types=1);

namespace App\Domains\Bootstrappers;

use App\Domains\Contracts\DomainBootstrapper;
use App\Domains\Support\DomainEntry;
use App\Sharing\Support\ShareRecordRegistry;

/**
 * Registers the shareable record types the domain declares, so Core can preview and share its records by alias.
 */
final readonly class RegisterShareRecords implements DomainBootstrapper
{
    public function __construct(private ShareRecordRegistry $records) {}

    public function __invoke(DomainEntry $domain): void
    {
        foreach ($domain->shareRecords() as $registration) {
            $this->records->register($registration);
        }
    }
}
