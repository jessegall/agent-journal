<?php

declare(strict_types=1);

namespace App\Support\Bootstrappers;

use App\Contracts\Domains\DomainBootstrapper;
use App\Contracts\Records\RecordProviderRegistration;
use App\Support\DomainEntry;

/**
 * Registers the record providers the domain declares, so Core can read and link its records by alias.
 */
final readonly class RegisterLinkRecords implements DomainBootstrapper
{
    public function __construct(private RecordProviderRegistration $providers) {}

    public function __invoke(DomainEntry $domain): void
    {
        foreach ($domain->linkRecords() as $type => $providerClass) {
            $this->providers->register($type, $providerClass);
        }
    }
}
