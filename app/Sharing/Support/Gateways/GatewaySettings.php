<?php

declare(strict_types=1);

namespace App\Sharing\Support\Gateways;

use Spatie\LaravelData\Data;

/**
 * What a gateway configuration pins: the registered gateway key, the program version, the provider host, the fixed
 * public origin, the listener port it forwards to and the names of the stored secrets it needs, never the secrets.
 */
final class GatewaySettings extends Data
{
    /**
     * @param  list<string>  $secretReferences
     */
    public function __construct(
        public readonly string $gatewayKey,
        public readonly string $executableVersion,
        public readonly string $providerHost,
        public readonly string $publicOrigin,
        public readonly int $listenerPort,
        public readonly array $secretReferences,
    ) {}
}
