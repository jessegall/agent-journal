<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One row of a declared collection, keyed by the record it shows: its label and its escaped value, the keys of its
 * window's query it sets when chosen, none for a row that leads nowhere, whether it is the row chosen now, a line
 * under its label, and the page of its own it opens, such as a record's.
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
        public readonly string $value = '',
        public readonly array $query = [],
        public readonly bool $isCurrent = false,
        public readonly string|Optional $detail = new Optional(),
        public readonly string|Optional $href = new Optional(),
    ) {}
}
