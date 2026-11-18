<?php

declare(strict_types=1);

namespace App\Http\Data\Sharing;

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
}
