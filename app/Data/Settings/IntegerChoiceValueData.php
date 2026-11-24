<?php

declare(strict_types=1);

namespace App\Data\Settings;

use App\Contracts\Settings\CatalogueValue;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The chosen whole-number option of a choice setting.
 */
#[TypeScript]
final class IntegerChoiceValueData extends Data implements CatalogueValue
{
    public function __construct(
        #[MapName('value')]
        public readonly int $selectedKey,
        #[LiteralTypeScriptType("'integerChoice'")]
        public readonly string $type = 'integerChoice',
    ) {}
}
