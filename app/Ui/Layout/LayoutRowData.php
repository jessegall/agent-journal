<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One row of a declared collection, keyed by the record it shows: its label and its escaped value, the keys of its
 * window's query it sets when chosen, none for a row that leads nowhere, and whether it is the row chosen now.
 */
#[TypeScript]
final class LayoutRowData extends Data
{
    /**
     * @param  array<string, string>  $query
     */
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        public readonly string $value,
        public readonly array $query = [],
        public readonly bool $isCurrent = false,
    ) {}
}
