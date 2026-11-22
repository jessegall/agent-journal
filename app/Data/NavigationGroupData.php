<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A sidebar group that heads at least one visible root item: its full key, which root items name, and its label.
 */
#[TypeScript]
final class NavigationGroupData extends Data
{
    public function __construct(public readonly string $key, public readonly string $label) {}
}
