<?php

declare(strict_types=1);

namespace App\Settings\Data;

use App\Settings\Contracts\CatalogueValue;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The chosen text option of a choice setting.
 */
#[TypeScript]
final class StringChoiceValueData extends Data implements CatalogueValue
{
    public function __construct(
        public readonly string $value,
        #[LiteralTypeScriptType("'stringChoice'")]
        public readonly string $type = 'stringChoice',
    ) {}
}
