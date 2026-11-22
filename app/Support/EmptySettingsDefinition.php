<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\SettingsDefinition;

/**
 * The definition of an owner that declares no settings.
 */
final class EmptySettingsDefinition implements SettingsDefinition
{
    public function groups(): array
    {
        return [];
    }
}
