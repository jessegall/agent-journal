<?php

declare(strict_types=1);

namespace App\Docking\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The offer to dock a shown source: the action's label, the source, where the dock request goes and which field
 * names the chosen destination, and the destinations the viewer may choose.
 */
#[TypeScript]
final class DockOfferData extends Data
{
    /**
     * @param  list<DockDestinationOptionData>  $destinations
     */
    public function __construct(
        public readonly string $label,
        public readonly string $type,
        public readonly string $id,
        public readonly string $url,
        public readonly string $destinationField,
        #[DataCollectionOf(DockDestinationOptionData::class)]
        public readonly array $destinations,
    ) {}
}
