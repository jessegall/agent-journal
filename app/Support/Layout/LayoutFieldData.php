<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Buildable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A layout field's binding: the query key it writes in its own window, the value it shows now and the keys a new
 * value clears, such as the page or the chosen row, so a new filter starts at the first page, and for a choice field the
 * values it offers with the label shown for each, the value itself where none is given.
 */
#[TypeScript]
final class LayoutFieldData extends Data
{
    /** @use Buildable<LayoutFieldDataFields> */
    use Buildable;

    protected const string FIELDS = LayoutFieldDataFields::class;

    /**
     * @param  list<string>  $clears
     * @param  list<string>  $options
     * @param  list<string>  $optionLabels  the label of each option, in the order of the options
     */
    public function __construct(
        public readonly string $name,
        public readonly string $value = '',
        public readonly array $clears = [],
        public readonly array $options = [],
        public readonly array $optionLabels = [],
    ) {}
}
