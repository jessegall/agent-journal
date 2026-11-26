<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\BadSettings;

use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Contracts\SettingsProvider;
use App\Settings\Declarations\SettingGroup;
use App\Settings\Declarations\StringSetting;
use App\Support\Domain;
use App\Support\Exports;
use Tests\Fixtures\Settings\SettingsList;

final class BadSettingsDomain extends Domain implements SettingsProvider
{
    public function description(): string
    {
        return 'A fixture domain whose setting key is not allowed.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()->build();
    }

    public function settings(): SettingsDefinition
    {
        return new SettingsList(
            [SettingGroup::make('desk', 'Desk', [StringSetting::make('Greeting', 'Greeting', 'Welcome')])],
        );
    }
}
