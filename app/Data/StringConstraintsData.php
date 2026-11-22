<?php

declare(strict_types=1);

namespace App\Data;

use App\Contracts\Settings\CatalogueConstraints;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The shortest and longest text a setting accepts, in UTF-8 bytes.
 */
#[TypeScript]
final class StringConstraintsData extends Data implements CatalogueConstraints
{
    public function __construct(
        public readonly int $minimumLength,
        public readonly int $maximumLength,
        #[LiteralTypeScriptType("'string'")]
        public readonly string $type = 'string',
    ) {}
}
