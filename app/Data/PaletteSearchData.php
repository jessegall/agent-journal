<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What one palette search answers: its status, the hits in the one global order, the direct open of a complete
 * reference with its label such as Open Task 2241, the inline hints for input too short to search, the scope
 * alternatives, the narrower scopes after a stalled source, the reason when it ended early, and the continuation.
 */
#[TypeScript]
final class PaletteSearchData extends Data
{
    /**
     * @param  list<PaletteHitData>  $hits
     * @param  list<string>  $hints
     * @param  list<PaletteSourceData>  $alternatives
     * @param  list<string>  $narrowerScopes
     */
    public function __construct(
        public readonly string $status,
        #[DataCollectionOf(PaletteHitData::class)]
        public readonly array $hits,
        public readonly PaletteHitData|null $directOpen,
        public readonly string|null $directOpenLabel,
        public readonly array $hints,
        #[DataCollectionOf(PaletteSourceData::class)]
        public readonly array $alternatives,
        public readonly array $narrowerScopes,
        public readonly string|null $reason,
        public readonly string|null $continuation,
    ) {}
}
