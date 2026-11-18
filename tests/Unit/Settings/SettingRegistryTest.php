<?php

declare(strict_types=1);

namespace Tests\Unit\Settings;

use App\Settings\Declarations\SettingGroup;
use App\Settings\Declarations\StringSetting;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Exceptions\SettingHandleUnknown;
use App\Settings\Support\CoreSettings;
use App\Settings\Support\SettingRegistry;
use Tests\Fixtures\Domains\Library\LibrarySettings;
use Tests\Fixtures\Settings\SettingsList;
use Tests\TestCase;

/**
 * The settings registry checks every owner's declarations together and knows a setting only as the exact object its
 * owner registered.
 */
final class SettingRegistryTest extends TestCase
{
    public function test_each_registered_setting_resolves_to_its_owner_and_key(): void
    {
        $core = new CoreSettings();
        $library = new LibrarySettings();
        $registry = SettingRegistry::from(['Core' => $core, 'Library' => $library]);

        $this->assertSame(['Core', 'display_name'], [$registry->ownerOf($core->displayName)->owner, $registry->ownerOf($core->displayName)->key]);
        $this->assertSame(['Library', 'greeting'], [$registry->ownerOf($library->greeting)->owner, $registry->ownerOf($library->greeting)->key]);
        $this->assertSame('desk', $registry->ownerOf($library->desk)->key);
        $this->assertSame($library, $registry->definition('Library'));
    }

    public function test_a_group_key_used_by_a_plain_and_a_toggle_group_is_refused(): void
    {
        $this->expectException(SettingDeclarationInvalid::class);
        $this->expectExceptionMessage('Library declares the settings group desk twice');

        SettingRegistry::from(['Core' => new CoreSettings(), 'Library' => new SettingsList([
            SettingGroup::make('desk', 'Desk', []),
            ToggleGroup::make('desk', 'Desk', true, []),
        ])]);
    }

    public function test_a_setting_in_a_plain_and_a_toggle_group_is_refused(): void
    {
        $greeting = StringSetting::make('greeting', 'Greeting', 'Hi');

        $this->expectException(SettingDeclarationInvalid::class);
        $this->expectExceptionMessage('Library declares the setting greeting twice');

        SettingRegistry::from(['Core' => new CoreSettings(), 'Library' => new SettingsList([
            SettingGroup::make('desk', 'Desk', [$greeting]),
            ToggleGroup::make('door', 'Door', true, [$greeting]),
        ])]);
    }

    public function test_a_setting_from_another_instance_is_unknown(): void
    {
        $registry = SettingRegistry::from(['Core' => new CoreSettings()]);

        $this->expectException(SettingHandleUnknown::class);
        $this->expectExceptionMessage('display_name');

        $registry->ownerOf(new CoreSettings()->displayName);
    }

    public function test_an_owner_named_core_in_another_case_is_refused(): void
    {
        $this->expectException(SettingDeclarationInvalid::class);
        $this->expectExceptionMessage('core');

        SettingRegistry::from(['Core' => new CoreSettings(), 'core' => new LibrarySettings()]);
    }

    public function test_core_must_come_first(): void
    {
        $this->expectException(SettingDeclarationInvalid::class);

        SettingRegistry::from(['Library' => new LibrarySettings(), 'Core' => new CoreSettings()]);
    }

    public function test_two_owners_differing_only_in_case_are_refused(): void
    {
        $this->expectException(SettingDeclarationInvalid::class);
        $this->expectExceptionMessage('library');

        SettingRegistry::from(['Core' => new CoreSettings(), 'Library' => new LibrarySettings(), 'library' => new SettingsList([])]);
    }

    public function test_one_definition_class_for_two_owners_is_refused(): void
    {
        $this->expectException(SettingDeclarationInvalid::class);
        $this->expectExceptionMessage('Shelves');

        SettingRegistry::from(['Core' => new CoreSettings(), 'Library' => new LibrarySettings(), 'Shelves' => new LibrarySettings()]);
    }

    public function test_a_key_in_two_groups_is_refused_with_owner_and_key(): void
    {
        $this->expectException(SettingDeclarationInvalid::class);
        $this->expectExceptionMessage('Library declares the setting greeting twice');

        SettingRegistry::from(['Core' => new CoreSettings(), 'Library' => new SettingsList([
            SettingGroup::make('desk', 'Desk', [StringSetting::make('greeting', 'Greeting', 'Hi')]),
            SettingGroup::make('door', 'Door', [StringSetting::make('greeting', 'Greeting', 'Hi')]),
        ])]);
    }

    public function test_a_group_key_twice_is_refused(): void
    {
        $this->expectException(SettingDeclarationInvalid::class);
        $this->expectExceptionMessage('desk');

        SettingRegistry::from(['Core' => new CoreSettings(), 'Library' => new SettingsList([
            SettingGroup::make('desk', 'Desk', []),
            SettingGroup::make('desk', 'Desk', []),
        ])]);
    }

    public function test_settings_past_the_limit_per_owner_are_refused(): void
    {
        $settings = array_map(fn (int $number) => StringSetting::make("setting_{$number}", 'Setting', ''), range(1, SettingRegistry::SETTINGS_PER_OWNER + 1));

        $this->expectException(SettingDeclarationInvalid::class);
        $this->expectExceptionMessage('Library declares more than '.SettingRegistry::SETTINGS_PER_OWNER.' settings');

        SettingRegistry::from(['Core' => new CoreSettings(), 'Library' => new SettingsList([SettingGroup::make('many', 'Many', $settings)])]);
    }
}
