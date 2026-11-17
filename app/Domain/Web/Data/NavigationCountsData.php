<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The counts beside visible navigation items, by item key; an item whose count failed has none.
 */
#[TypeScript]
final class NavigationCountsData extends Data
{
    /**
     * @param  array<string, int>  $counts
     */
    public function __construct(public readonly array $counts) {}
}
