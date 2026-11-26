<?php

declare(strict_types=1);

namespace App\Settings\Data;

use App\Settings\Contracts\CatalogueValue;
use Spatie\LaravelData\Attributes\MapName;
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
        #[MapName('value')]
        public readonly string $settingText,
        #[LiteralTypeScriptType("'string'")]
        public readonly string $type = 'string',
    ) {}
}
