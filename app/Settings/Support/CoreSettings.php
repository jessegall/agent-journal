<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Declarations\SettingGroup;
use App\Settings\Declarations\StringSetting;

/**
 * The settings Core itself declares.
 */
final class CoreSettings implements SettingsDefinition
{
    public readonly StringSetting $displayName;

    public readonly SettingGroup $general;

    public function __construct()
    {
        $this->displayName = StringSetting::make(key: 'display_name', label: 'Journal name', default: 'Journal', minimumLength: 1, maximumLength: 200);
        $this->general = SettingGroup::make('general', 'General', [$this->displayName]);
    }

    public function groups(): array
    {
        return [$this->general];
    }
}
