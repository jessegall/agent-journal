<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A line's classification as plain data: whether every part is known, the classes the line needs and each part.
 */
#[TypeScript]
final class ClassificationSummaryData extends Data
{
    /**
     * @param  list<string>  $classes
     * @param  list<PartSummaryData>  $parts
     */
    public function __construct(
        public readonly bool $isKnown,
        public readonly array $classes,
        #[DataCollectionOf(PartSummaryData::class)]
        public readonly array $parts,
    ) {}
}
