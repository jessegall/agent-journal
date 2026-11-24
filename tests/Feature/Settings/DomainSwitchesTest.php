<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Commands\DisableSettingGroup\DisableSettingGroupCommand;
use App\Commands\SetStringSetting\SetStringSettingCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Settings\SettingsResolver;
use App\Declarations\ToggleGroup;
use App\Enums\SettingsOutcome;
use App\Exceptions\SettingUnavailable;
use App\Support\CoreSettings;
use App\Support\DisabledSettingsGroup;
use App\Support\DomainSwitches;
use App\Support\SettingRegistry;
use App\Values\GroupReference;
use App\Values\SettingReference;
use Tests\Support\ActsAsTestOwner;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * Core declares one switch per domain that can be switched off, on by default and holding no settings, and the owner
 * switches a domain with the ordinary settings group commands.
 */
final class DomainSwitchesTest extends TestCase
{
    use ActsAsTestOwner;
    use CommitsHookRows;

    private const string JOURNAL_NAME = 'My journal';

    /**
     * The bus commits the settings commands for real, so this table is emptied around each test.
     */
    private const array TABLES = ['settings_records'];

    public function test_core_declares_one_empty_switch_on_by_default_for_each_domain_but_access(): void
    {
        $core = $this->app->make(SettingRegistry::class)->definition('Core');
        $this->assertInstanceOf(CoreSettings::class, $core);
        $switches = array_values(array_filter($core->groups(), fn ($group) => $group instanceof ToggleGroup));
        $keys = array_map(fn (ToggleGroup $group) => $group->key, $switches);

        $this->assertSame('general', $core->groups()[0]->key());
        $this->assertContains('domain_tasks', $keys);
        $this->assertContains('domain_plans', $keys);
        $this->assertNotContains('domain_access', $keys);

        $this->assertSame(
            [true],
            array_values(array_unique(array_map(fn (ToggleGroup $group) => $group->isDefaultEnabled, $switches))),
        );

        $this->assertSame(
            [[]],
            array_values(array_unique(array_map(fn (ToggleGroup $group) => $group->settings, $switches), SORT_REGULAR)),
        );

        $this->assertSame(
            $this->app->make(DomainSwitches::class)->of('Plans')->get(),
            $switches[array_search('domain_plans', $keys, true)],
        );

        $this->assertTrue($this->app->make(DomainSwitches::class)->of('Access')->isEmpty());
    }

    public function test_the_owner_switches_a_domain_off_with_the_ordinary_group_command(): void
    {
        $change = $this->app->make(CommandBus::class)->run(
            new DisableSettingGroupCommand(new GroupReference('Core', 'domain_plans'), 0),
        );

        $this->assertSame([1, SettingsOutcome::Changed], [$change->revision, $change->outcome]);
        $this->app->forgetScopedInstances();

        $this->assertInstanceOf(
            DisabledSettingsGroup::class,
            $this->app->make(SettingsResolver::class)->group(
                $this->app->make(DomainSwitches::class)->of('Plans')->get(),
            ),
        );
    }

    public function test_access_has_no_switch(): void
    {
        $this->expectException(SettingUnavailable::class);

        $this->app->make(CommandBus::class)->run(
            new DisableSettingGroupCommand(new GroupReference('Core', 'domain_access'), 0),
        );
    }

    public function test_core_settings_still_read_and_change_while_a_domain_is_off(): void
    {
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new DisableSettingGroupCommand(new GroupReference('Core', 'domain_plans'), 0));

        $change = $bus->run(new SetStringSettingCommand(new SettingReference('Core', 'display_name'), self::JOURNAL_NAME, 1));
        $this->app->forgetScopedInstances();
        $core = $this->app->make(SettingRegistry::class)->definition('Core');
        $this->assertInstanceOf(CoreSettings::class, $core);

        $this->assertSame(SettingsOutcome::Changed, $change->outcome);
        $this->assertSame(self::JOURNAL_NAME, $this->app->make(SettingsResolver::class)->string($core->displayName));
    }
}
