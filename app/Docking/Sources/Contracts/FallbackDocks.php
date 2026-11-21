<?php

declare(strict_types=1);

namespace App\Docking\Sources\Contracts;

use App\Docking\Sources\DockDefinition;

/**
 * The types that dock with a plain fallback card when no owner registered a card of their own.
 */
interface FallbackDocks
{
    public function covers(string $type): bool;

    public function definition(string $type): DockDefinition;
}
