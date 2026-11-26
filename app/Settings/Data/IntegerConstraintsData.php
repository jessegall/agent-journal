<?php

declare(strict_types=1);

namespace App\Settings\Data;

use App\Settings\Contracts\CatalogueConstraints;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The smallest and largest whole number a setting accepts.
 */
#[TypeScript]
final class IntegerConstraintsData extends Data implements CatalogueConstraints
{
    public function __construct(
        public readonly int $minimum,
        public readonly int $maximum,
        #[LiteralTypeScriptType("'integer'")]
        public readonly string $type = 'integer',
    ) {}
}
