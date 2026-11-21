<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One row of a declared collection, keyed by the record it shows: its label and its escaped value.
 */
#[TypeScript]
final class LayoutRowData extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        public readonly string $value,
    ) {}
}
