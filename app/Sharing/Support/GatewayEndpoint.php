<?php

declare(strict_types=1);

namespace App\Sharing\Support;

/**
 * An open gateway endpoint: the run and endpoint version that opened it, the public origin it answers on and the
 * process of this run that serves it.
 */
final readonly class GatewayEndpoint
{
    public function __construct(
        public string $runId,
        public int $endpointVersion,
        public string $publicOrigin,
        public string $processReference,
    ) {}

    /**
     * The endpoint a claimed operation opens or closes, named by its run and version, the reference its program is
     * kept under.
     */
    public static function forOperation(GatewayOperation $operation): self
    {
        return new self($operation->runId, $operation->endpointVersion, $operation->settings()->publicOrigin, self::referenceOf($operation->runId, $operation->endpointVersion));
    }

    /**
     * The reference a run keeps the program of one endpoint version under.
     */
    public static function referenceOf(string $runId, int $endpointVersion): string
    {
        return "{$runId}:{$endpointVersion}";
    }
}
