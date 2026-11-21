<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Documents and reports Chat may suggest docking: the newest that still ask for attention. Suggesting docks nothing.
 */
#[TypeScript]
final class DockData extends Data
{
    /**
     * @param  list<DockSuggestion>  $suggestions
     */
    public function __construct(
        #[DataCollectionOf(DockSuggestion::class)]
        public readonly array $suggestions,
    ) {}
}
