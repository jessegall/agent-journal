<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Navigation\Layout\LayoutMenuData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One row of a declared collection, keyed by its record: its label and escaped value, the query keys it sets when
 * chosen, whether it is chosen now, a line under its label, the page it opens, its actions menu, its leading and
 * trailing parts, a fact's linked value, and whether its trailing parts stand in fixed columns.
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
        public readonly bool $hasColumns = false,
    ) {}

    /**
     * The parts that lead and trail this row, in the order they are drawn.
     *
     * @return list<LayoutPartData>
     */
    public function parts(): array
    {
        $parts = [];

        if (! $this->leading instanceof Optional) {
            $parts = $this->leading;
        }

        if (! $this->trailing instanceof Optional) {
            $parts = [...$parts, ...$this->trailing];
        }

        return $parts;
    }
}
