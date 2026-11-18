<?php

declare(strict_types=1);

namespace App\Settings\Data;

use App\Settings\Contracts\CatalogueValue;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A text setting's value.
 */
#[TypeScript]
final class StringValueData extends Data implements CatalogueValue
{
    public function __construct(
        public readonly string $value,
        #[LiteralTypeScriptType("'string'")]
        public readonly string $type = 'string',
    ) {}
}
