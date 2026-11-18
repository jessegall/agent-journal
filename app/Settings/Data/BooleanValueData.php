<?php

declare(strict_types=1);

namespace App\Settings\Data;

use App\Settings\Contracts\CatalogueValue;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An on-or-off setting's value.
 */
#[TypeScript]
final class BooleanValueData extends Data implements CatalogueValue
{
    public function __construct(
        public readonly bool $value,
        #[LiteralTypeScriptType("'boolean'")]
        public readonly string $type = 'boolean',
    ) {}
}
