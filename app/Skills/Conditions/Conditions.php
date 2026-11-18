<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

/**
 * Builds skill conditions for a skill's condition() method.
 */
final class Conditions
{
    public static function everyone(): Everyone
    {
        return new Everyone();
    }
}
