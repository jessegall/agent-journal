<?php

declare(strict_types=1);

namespace App\Settings\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A text setting's value.
 */
#[TypeScript]
final class StringValueData extends Data
{
    public function __construct(
        public readonly string $value,
        #[LiteralTypeScriptType("'string'")]
        public readonly string $kind = 'string',
    ) {}
}
