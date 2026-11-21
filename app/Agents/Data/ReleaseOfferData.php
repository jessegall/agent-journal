<?php

declare(strict_types=1);

namespace App\Agents\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the current release offers a machine that connects: its platforms and the capabilities it still lacks.
 */
#[TypeScript]
final class ReleaseOfferData extends Data
{
    /**
     * @param  list<ReleaseTargetData>  $targets
     * @param  list<string>  $withheldCapabilities
     */
    public function __construct(
        public readonly string|null $release,
        #[DataCollectionOf(ReleaseTargetData::class)]
        public readonly array $targets,
        public readonly array $withheldCapabilities,
    ) {}
}
