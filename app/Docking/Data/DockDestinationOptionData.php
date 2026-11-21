<?php

declare(strict_types=1);

namespace App\Docking\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One place a source can be docked, as the picker shows it.
 */
#[TypeScript]
final class DockDestinationOptionData extends Data
{
    public function __construct(
        public readonly string $value,
        public readonly string $label,
    ) {}
}
