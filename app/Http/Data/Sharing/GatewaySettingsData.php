<?php

declare(strict_types=1);

namespace App\Http\Data\Sharing;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The owner's gateway settings page: the registered gateway keys, every settings revision newest first, and whether
 * the sharing service runs at all.
 */
#[TypeScript]
final class GatewaySettingsData extends Data
{
    /**
     * @param  list<string>  $gatewayKeys
     * @param  list<GatewayRevisionData>  $revisions
     */
    public function __construct(
        public readonly array $gatewayKeys,
        #[DataCollectionOf(GatewayRevisionData::class)]
        public readonly array $revisions,
        public readonly bool $isOffline,
    ) {}
}
