<?php

declare(strict_types=1);

namespace App\Data\Sharing;

use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayEndpoint;
use App\Models\Sharing\ShareInstallation;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where the share's gateway stands at runtime: whether a sharing service holds the gateways at all, and the endpoint
 * version serving the share with its last healthy report, healthy for 45 seconds after it.
 */
#[TypeScript]
final class ShareRuntimeData extends Data
{
    public function __construct(
        public readonly bool $isOffline,
        public readonly int|null $endpointVersion,
        public readonly string|null $lastHealthAt,
        public readonly bool $isHealthy,
    ) {}

    /**
     * The sharing service's hold on the gateways and the newest endpoint serving the share's configuration.
     */
    public static function fromShare(Share $share): self
    {
        $endpoint = $share->newestRunningEndpoint();

        return new self(
            ! ShareInstallation::hasLiveRun(),
            $endpoint->map(fn (ShareGatewayEndpoint $running) => $running->endpoint_version)->getOrElse(null),
            $endpoint->map(fn (ShareGatewayEndpoint $running) => $running->last_health_at?->toIso8601String())
                ->getOrElse(null),
            $endpoint->map(fn (ShareGatewayEndpoint $running) => $running->isHealthy())->getOrElse(false),
        );
    }
}
