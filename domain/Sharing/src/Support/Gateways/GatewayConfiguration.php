<?php

declare(strict_types=1);

namespace Domain\Sharing\Support\Gateways;

/**
 * One immutable settings revision of a gateway configuration: which configuration, its version and its settings.
 */
final readonly class GatewayConfiguration
{
    public function __construct(
        public string $configurationId,
        public int $configurationVersion,
        public GatewaySettings $settings,
    ) {}

    /**
     * The key of the gateway this configuration sets up.
     */
    public function gatewayKey(): string
    {
        return $this->settings->gatewayKey;
    }
}
