<?php

declare(strict_types=1);

namespace App\Settings\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A whole-number setting's value.
 */
#[TypeScript]
final class IntegerValueData extends Data
{
    public function __construct(
        public readonly int $value,
        #[LiteralTypeScriptType("'integer'")]
        public readonly string $type = 'integer',
    ) {}
}
