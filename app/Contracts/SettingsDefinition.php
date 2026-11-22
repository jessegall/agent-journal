<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Declarations\SettingGroup;
use App\Declarations\ToggleGroup;

/**
 * The settings one owner declares, in groups.
 */
interface SettingsDefinition
{
    /**
     * @return list<SettingGroup|ToggleGroup>
     */
    public function groups(): array;
}
