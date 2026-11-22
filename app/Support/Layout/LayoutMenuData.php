<?php

declare(strict_types=1);

namespace App\Support\Layout;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A menu as the actor may use it on one record: its full key, its label, which names its actions button, and its
 * groups in order, each holding at least one item; a menu with no allowed item has no groups and is not drawn.
 */
#[TypeScript]
final class LayoutMenuData extends Data
{
    /**
     * @param  list<LayoutMenuGroupData>  $groups
     */
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        #[DataCollectionOf(LayoutMenuGroupData::class)]
        public readonly array $groups,
    ) {}
}
