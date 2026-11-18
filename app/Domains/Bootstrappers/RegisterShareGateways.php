<?php

declare(strict_types=1);

namespace App\Domains\Bootstrappers;

use App\Domains\Contracts\DomainBootstrapper;
use App\Domains\Support\DomainEntry;
use App\Sharing\Support\ShareGatewayRegistry;

/**
 * Registers the share gateways the domain brings, beside Core's own.
 */
final readonly class RegisterShareGateways implements DomainBootstrapper
{
    public function __construct(private ShareGatewayRegistry $gateways) {}

    public function __invoke(DomainEntry $domain): void
    {
        foreach ($domain->shareGateways() as $key => $gatewayClass) {
            $this->gateways->register($key, $gatewayClass);
        }
    }
}
