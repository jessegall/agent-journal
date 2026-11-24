<?php

declare(strict_types=1);

namespace App\Support\Sources\Contracts;

use App\Support\Sources\DockDefinition;

/**
 * The types that dock with a plain fallback card when no owner registered a card of their own.
 */
interface FallbackDocks
{
    /**
     * Whether a fallback dock is defined for records of the type.
     */
    public function covers(string $type): bool;

    /**
     * The fallback dock for records of the type.
     */
    public function definition(string $type): DockDefinition;
}
