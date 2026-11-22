<?php

declare(strict_types=1);

namespace App\Support;

/**
 * What a gateway configuration pins: the registered gateway key, the program version, the provider host, the fixed
 * public origin, the listener port it forwards to and the names of the stored secrets it needs, never the secrets.
 */
final readonly class GatewaySettings
{
    /**
     * @param  list<string>  $secretReferences
     */
    public function __construct(
        public string $gatewayKey,
        public string $executableVersion,
        public string $providerHost,
        public string $publicOrigin,
        public int $listenerPort,
        public array $secretReferences,
    ) {}
}
