<?php

declare(strict_types=1);

namespace App\Web\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One section Home's bar shows: the optional prop that carries its result and the component the manifest loads.
 */
#[TypeScript]
final class HomeSectionData extends Data
{
    public function __construct(
        public readonly string $propName,
        public readonly string $component,
    ) {}
}
