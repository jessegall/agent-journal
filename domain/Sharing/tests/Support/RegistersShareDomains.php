<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Support;

use App\Sharing\ShareRecordRegistry;
use App\Support\Domain;
use App\Support\DomainEntry;
use Domain\Sharing\Support\ShareGatewayRegistry;

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
