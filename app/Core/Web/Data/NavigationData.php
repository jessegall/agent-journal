<?php

declare(strict_types=1);

namespace App\Core\Web\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The navigation the signed-in user may see, root items in order, and the keys of the current item and its
 * ancestors, from the root down.
 */
#[TypeScript]
final class NavigationData extends Data
{
    /**
     * @param  list<NavigationItemData>  $items
     * @param  list<string>  $current
     */
    public function __construct(
        #[DataCollectionOf(NavigationItemData::class)]
        public readonly array $items,
        public readonly array $current,
    ) {}
}
