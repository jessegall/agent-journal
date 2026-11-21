<?php

declare(strict_types=1);

namespace App\Sharing\Data;

use App\Sharing\Support\GatewaySettings;
use Spatie\LaravelData\Data;

/**
 * A gateway configuration's settings column as it is stored: what GatewaySettings holds, by its property names.
 */
final class StoredGatewaySettings extends Data
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

    public function settings(): GatewaySettings
    {
        return new GatewaySettings(
            $this->gatewayKey,
            $this->executableVersion,
            $this->providerHost,
            $this->publicOrigin,
            $this->listenerPort,
            $this->secretReferences,
        );
    }
}
