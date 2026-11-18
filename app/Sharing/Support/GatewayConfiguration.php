<?php

declare(strict_types=1);

namespace App\Sharing\Support;

/**
 * One immutable settings revision of a gateway: its registered key, the pinned program version, the provider host,
 * the fixed public origin, the listener port it forwards to and the names of the stored secrets it needs.
 */
final readonly class GatewayConfiguration
{
    /**
     * @param  list<string>  $secretReferences
     */
    public function __construct(
        public string $configurationId,
        public int $configurationVersion,
        public string $gatewayKey,
        public string $executableVersion,
        public string $providerHost,
        public string $publicOrigin,
        public int $listenerPort,
        public array $secretReferences,
    ) {}
}
