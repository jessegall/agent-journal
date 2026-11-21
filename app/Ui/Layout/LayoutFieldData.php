<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A layout field's binding: the query key it writes in its own window and the value it shows now. Submitting it
 * changes that key and clears the list cursor, so a new filter starts at the first page.
 */
#[TypeScript]
final class LayoutFieldData extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly string $value,
    ) {}
}
