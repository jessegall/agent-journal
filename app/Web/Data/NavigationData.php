<?php

declare(strict_types=1);

namespace App\Web\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The navigation the signed-in user may see, root items in order, the sidebar groups they join in that order, and the
 * keys of the current item and its ancestors, from the root down.
 */
#[TypeScript]
final class NavigationData extends Data
{
    /**
     * @param  list<NavigationItemData>  $navigationLinks
     * @param  list<NavigationGroupData>  $groups
     * @param  list<string>  $current
     */
    public function __construct(
        #[MapName('items')]
        #[DataCollectionOf(NavigationItemData::class)]
        public readonly array $navigationLinks,
        #[DataCollectionOf(NavigationGroupData::class)]
        public readonly array $groups,
        public readonly array $current,
    ) {}
}
