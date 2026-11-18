<?php

declare(strict_types=1);

namespace App\Settings\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An exact decimal setting's value, as its canonical text so no digit is lost.
 */
#[TypeScript]
final class DecimalValueData extends Data
{
    public function __construct(
        public readonly string $value,
        #[LiteralTypeScriptType("'decimal'")]
        public readonly string $type = 'decimal',
    ) {}
}
