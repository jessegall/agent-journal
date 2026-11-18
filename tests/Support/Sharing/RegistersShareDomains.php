<?php

declare(strict_types=1);

namespace Tests\Support\Sharing;

use App\Domains\Support\Domain;
use App\Domains\Support\DomainEntry;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Sharing\Support\ShareRecordRegistry;

/**
 * Registers a fixture domain's share records and gateways as the sharing provider does at boot.
 */
trait RegistersShareDomains
{
    /**
     * @param  class-string<Domain>  $domainClass
     */
    private function registerShareDomain(string $domainClass): void
    {
        $entry = DomainEntry::fromClass($domainClass);
        foreach ($entry->shareRecords() as $registration) {
            $this->app->make(ShareRecordRegistry::class)->register($registration);
        }
        foreach ($entry->shareGateways() as $key => $gatewayClass) {
            $this->app->make(ShareGatewayRegistry::class)->register($key, $gatewayClass);
        }
    }
}
