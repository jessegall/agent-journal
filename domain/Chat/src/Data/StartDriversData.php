<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The drivers a start form offers, in the catalogue's order, each saying whether it can be chosen.
 */
#[TypeScript]
final class StartDriversData extends Data
{
    /**
     * @param  list<DriverChoiceData>  $drivers
     */
    public function __construct(
        #[DataCollectionOf(DriverChoiceData::class)]
        public readonly array $drivers,
    ) {}
}
