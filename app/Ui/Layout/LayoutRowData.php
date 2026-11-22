<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One row of a declared collection, keyed by the record it shows: its label and its escaped value, the keys of its
 * window's query it sets when chosen, none for a row that leads nowhere, whether it is the row chosen now, a line
 * under its label, the page of its own it opens, such as a record's, the actions menu of its record, the parts that
 * lead and trail it, such as a driver mark and a status, and a fact's value in linked pieces.
 */
#[TypeScript]
final class LayoutRowData extends Data
{
    /**
     * @param  array<string, string>  $query
     * @param  list<LayoutPartData>|Optional  $leading
     * @param  list<LayoutPartData>|Optional  $trailing
     */
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        public readonly string $value = '',
        public readonly array $query = [],
        public readonly bool $isCurrent = false,
        public readonly string|Optional $detail = new Optional(),
        public readonly string|Optional $href = new Optional(),
        public readonly LayoutMenuData|Optional $menu = new Optional(),
        #[DataCollectionOf(LayoutPartData::class)]
        public readonly array|Optional $leading = new Optional(),
        #[DataCollectionOf(LayoutPartData::class)]
        public readonly array|Optional $trailing = new Optional(),
        public readonly LayoutFactValueData|Optional $fact = new Optional(),
    ) {}

    /**
     * The parts that lead and trail this row, in the order they are drawn.
     *
     * @return list<LayoutPartData>
     */
    public function parts(): array
    {
        return [
            ...($this->leading instanceof Optional ? [] : $this->leading),
            ...($this->trailing instanceof Optional ? [] : $this->trailing),
        ];
    }
}
