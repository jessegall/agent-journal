<?php

declare(strict_types=1);

namespace App\Settings\Data;

use App\Settings\Contracts\CatalogueValue;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A stored override its setting does not accept; what was stored is never shown, and resetting the setting repairs
 * it.
 */
#[TypeScript]
final class InvalidValueData extends Data implements CatalogueValue
{
    public function __construct(
        #[LiteralTypeScriptType("'invalid'")]
        public readonly string $type = 'invalid',
    ) {}

    public function formText(): string|null
    {
        return null;
    }
}
