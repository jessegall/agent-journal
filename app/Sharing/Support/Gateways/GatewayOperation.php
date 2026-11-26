<?php

declare(strict_types=1);

namespace App\Sharing\Support\Gateways;

/**
 * One claimed gateway operation the supervisor carries out: under which run, for which endpoint version, with which
 * lease token and until when the lease holds, in Unix seconds.
 */
final readonly class GatewayOperation
{
    public function __construct(
        public string $operationId,
        public string $runId,
        public int $endpointVersion,
        public string $leaseToken,
        public int $leaseEndsAt,
        public GatewayConfiguration $configuration,
    ) {}

    public function settings(): GatewaySettings
    {
        return $this->configuration->settings;
    }

    /**
     * The id of the gateway configuration the operation is carried out under.
     */
    public function configurationId(): string
    {
        return $this->configuration->configurationId;
    }
}
