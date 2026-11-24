<?php

declare(strict_types=1);

namespace App\Data\Palette;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of the sources the palette's scope picker offers for a prefix, and the key the next page starts after.
 */
#[TypeScript]
final class PaletteSourcesData extends Data
{
    /**
     * @param  list<PaletteSourceData>  $sources
     */
    public function __construct(
        public readonly string $prefix,
        #[DataCollectionOf(PaletteSourceData::class)]
        public readonly array $sources,
        public readonly string|null $nextAfter,
    ) {}
}
