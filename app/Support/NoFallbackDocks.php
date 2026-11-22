<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\DockDefinitionInvalid;
use App\Support\Sources\Contracts\FallbackDocks;
use App\Support\Sources\DockDefinition;

/**
 * No type docks with a fallback card, for a journal with no records.
 */
final readonly class NoFallbackDocks implements FallbackDocks
{
    public function covers(string $type): bool
    {
        return false;
    }

    public function definition(string $type): DockDefinition
    {
        throw DockDefinitionInvalid::unknown($type);
    }
}
