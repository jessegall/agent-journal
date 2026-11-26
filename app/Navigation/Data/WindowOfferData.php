<?php

declare(strict_types=1);

namespace App\Navigation\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What a window offers for the record it shows: the action's label, the record, where the request goes and which field
 * names the chosen destination, and the destinations the viewer may choose.
 */
#[TypeScript]
final class WindowOfferData extends Data
{
    /**
     * @param  list<WindowOfferChoiceData>  $destinations
     */
    public function __construct(
        public readonly string $label,
        public readonly string $type,
        public readonly string $id,
        public readonly string $url,
        public readonly string $destinationField,
        #[DataCollectionOf(WindowOfferChoiceData::class)]
        public readonly array $destinations,
    ) {}
}
