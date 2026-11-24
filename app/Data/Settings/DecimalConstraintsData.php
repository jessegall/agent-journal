<?php

declare(strict_types=1);

namespace App\Data\Settings;

use App\Contracts\Settings\CatalogueConstraints;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The digits, fractional digits and bounds of an exact decimal setting; a bound is canonical text and absent when
 * not declared.
 */
#[TypeScript]
final class DecimalConstraintsData extends Data implements CatalogueConstraints
{
    public function __construct(
        public readonly int $precision,
        public readonly int $scale,
        public readonly string|Optional $minimum = new Optional(),
        public readonly string|Optional $maximum = new Optional(),
        #[LiteralTypeScriptType("'decimal'")]
        public readonly string $type = 'decimal',
    ) {}
}
