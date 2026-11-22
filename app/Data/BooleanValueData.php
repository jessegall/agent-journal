<?php

declare(strict_types=1);

namespace App\Data;

use App\Contracts\Settings\CatalogueValue;
use Spatie\LaravelData\Attributes\MapName;
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
        #[MapName('value')]
        public readonly bool $enabled,
        #[LiteralTypeScriptType("'boolean'")]
        public readonly string $type = 'boolean',
    ) {}
}
