<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A recognized driver menu as a public frame shows it: its family, its option labels, the highlighted one (-1 when
 * the highlight cannot be told) and the screen revision it was read at, which a choice must name.
 */
#[TypeScript]
final class ScreenMenuData extends Data
{
    /**
     * @param  list<string>  $labels
     */
    public function __construct(
        public readonly string $family,
        public readonly array $labels,
        public readonly int $highlighted,
        public readonly int $revision,
    ) {}
}
