<?php

declare(strict_types=1);

namespace App\Settings\Data;

use App\Settings\Contracts\CatalogueValue;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A whole-number setting's value.
 */
#[TypeScript]
final class IntegerValueData extends Data implements CatalogueValue
{
    public function __construct(
        public readonly int $value,
        #[LiteralTypeScriptType("'integer'")]
        public readonly string $type = 'integer',
    ) {}
}
