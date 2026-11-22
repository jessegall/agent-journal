<?php

declare(strict_types=1);

namespace App\Data;

use App\Contracts\CatalogueValue;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An exact decimal setting's value, as its canonical text so no digit is lost.
 */
#[TypeScript]
final class DecimalValueData extends Data implements CatalogueValue
{
    public function __construct(
        #[MapName('value')]
        public readonly string $decimalText,
        #[LiteralTypeScriptType("'decimal'")]
        public readonly string $type = 'decimal',
    ) {}
}
