<?php

declare(strict_types=1);

namespace App\Data;

use App\Contracts\Settings\CatalogueValue;
use Spatie\LaravelData\Attributes\MapName;
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
        #[MapName('value')]
        public readonly string $selectedKey,
        #[LiteralTypeScriptType("'stringChoice'")]
        public readonly string $type = 'stringChoice',
    ) {}
}
