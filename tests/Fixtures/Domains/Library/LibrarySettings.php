<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Library;

use App\Contracts\Settings\SettingsDefinition;
use App\Declarations\SettingGroup;
use App\Declarations\StringSetting;

/**
 * A fixture definition that counts how often it is built.
 */
final class LibrarySettings implements SettingsDefinition
{
    public static int $built = 0;

    public readonly StringSetting $greeting;

    public readonly SettingGroup $desk;

    public function __construct()
    {
        self::$built++;
        $this->greeting = StringSetting::make('greeting', 'Greeting', 'Welcome');
        $this->desk = SettingGroup::make('desk', 'Desk', [$this->greeting]);
    }

    public function groups(): array
    {
        return [$this->desk];
    }
}
