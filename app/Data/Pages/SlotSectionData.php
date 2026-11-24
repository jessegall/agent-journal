<?php

declare(strict_types=1);

namespace App\Data\Pages;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One section a slot shows, such as Home's bar or the chat's dock: the optional prop that carries its result and the
 * component the manifest loads.
 */
#[TypeScript]
final class SlotSectionData extends Data
{
    public function __construct(
        public readonly string $propName,
        public readonly string $component,
    ) {}
}
