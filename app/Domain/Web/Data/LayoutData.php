<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A layout the user saved, as the layouts menu lists it: its id as a decimal string, its name and its shape, which the
 * browser checks before it applies it.
 */
#[TypeScript]
final class LayoutData extends Data
{
    /**
     * @param  array<string, mixed>  $shape
     */
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        #[LiteralTypeScriptType('Record<string, unknown>')] public readonly array $shape,
    ) {}
}
