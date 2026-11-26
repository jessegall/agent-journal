<?php

declare(strict_types=1);

namespace App\Settings\Contracts;

use App\Settings\Declarations\SettingGroup;
use App\Settings\Declarations\ToggleGroup;

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
