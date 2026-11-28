<?php

declare(strict_types=1);

namespace App\Navigation\Layout;

use App\Web\Creation\Buildable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One group of a menu: its key, and its items in order, set apart from the next group by a separator.
 */
#[TypeScript]
final class LayoutMenuGroupData extends Data
{
    /** @use Buildable<LayoutMenuGroupDataFields> */
    use Buildable;

    protected const string FIELDS = LayoutMenuGroupDataFields::class;

    /**
     * @param  list<LayoutMenuItemData>  $items
     */
    public function __construct(
        public readonly string $key,
        #[DataCollectionOf(LayoutMenuItemData::class)]
        public readonly array $items,
    ) {}
}
