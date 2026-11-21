<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A layout field's binding: the query key it writes in its own window, the value it shows now and the keys a new
 * value clears, such as the page or the chosen row, so a new filter starts at the first page.
 */
#[TypeScript]
final class LayoutFieldData extends Data
{
    /**
     * @param  list<string>  $clears
     */
    public function __construct(
        public readonly string $name,
        public readonly string $value,
        public readonly array $clears = [],
    ) {}
}
