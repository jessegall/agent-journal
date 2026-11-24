<?php

declare(strict_types=1);

namespace App\Data\Navigation;

use App\Enums\Icon;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One visible navigation item with its visible children: where it links (its page, or for an item without a page its
 * first visible descendant), its group, whether it sits at the foot or only in the command palette, and whether a
 * count may follow for it.
 */
#[TypeScript]
final class NavigationItemData extends Data
{
    /**
     * @param  list<NavigationItemData>  $children
     */
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        #[DataCollectionOf(NavigationItemData::class)]
        public readonly array $children,
        public readonly bool $atFoot,
        public readonly bool $counted,
        public readonly bool $inSidebar,
        public readonly Icon|Optional $icon = new Optional(),
        public readonly string|Optional $url = new Optional(),
        public readonly string|Optional $group = new Optional(),
    ) {}
}
