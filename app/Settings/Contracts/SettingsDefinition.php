<?php

declare(strict_types=1);

namespace App\Settings\Contracts;

use App\Settings\Declarations\SettingGroup;

/**
 * The settings one owner declares, in groups.
 */
interface SettingsDefinition
{
    /**
     * @return list<SettingGroup>
     */
    public function groups(): array;
}
