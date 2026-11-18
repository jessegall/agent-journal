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
}
