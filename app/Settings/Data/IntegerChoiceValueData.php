<?php

declare(strict_types=1);

namespace App\Settings\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The chosen whole-number option of a choice setting.
 */
#[TypeScript]
final class IntegerChoiceValueData extends Data
{
    public function __construct(
        public readonly int $value,
        #[LiteralTypeScriptType("'integerChoice'")]
        public readonly string $type = 'integerChoice',
    ) {}
}
