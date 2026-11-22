<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\BadSettings;

use App\Support\Domain;
use App\Support\Exports;
use App\Contracts\SettingsProvider;
use App\Contracts\SettingsDefinition;
use App\Declarations\SettingGroup;
use App\Declarations\StringSetting;
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
