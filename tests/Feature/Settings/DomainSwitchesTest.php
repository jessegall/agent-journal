<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\TrustedEntryAuthority;
use App\Bus\Contracts\CommandBus;
use App\Domains\Support\DomainSwitches;
use App\Settings\Commands\DisableSettingGroup;
use App\Settings\Commands\SetStringSetting;
use App\Settings\Contracts\SettingsResolver;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Enums\SettingsOutcome;
use App\Settings\Exceptions\SettingUnavailable;
use App\Settings\Support\CoreSettings;
use App\Settings\Support\DisabledSettingsGroup;
use App\Settings\Support\SettingRegistry;
use App\Settings\Values\GroupReference;
use App\Settings\Values\SettingReference;
use Domain\Access\Support\AccessSettings;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Core declares one switch per domain that can be switched off, on by default and holding no settings, and the owner
 * switches a domain with the ordinary settings group commands.
 */
final class DomainSwitchesTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits the settings commands for real, so this table is emptied around each test.
     */
    private const array TABLES = ['settings_records'];

    protected function setUp(): void
    {
        parent::setUp();

        $ownerId = TestIds::of(7);
        $this->app->instance(AccessSettings::class, new AccessSettings($ownerId));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($ownerId), new TrustedEntryAuthority('test'));
    }

    public function test_core_declares_one_empty_switch_on_by_default_for_each_domain_but_access(): void
    {
        $core = $this->app->make(SettingRegistry::class)->definition('Core');
        $this->assertInstanceOf(CoreSettings::class, $core);
        $switches = array_slice($core->groups(), 1);
        $keys = array_map(fn (ToggleGroup $group) => $group->key, $switches);

        $this->assertSame('general', $core->groups()[0]->key());
        $this->assertContains('domain_tasks', $keys);
        $this->assertContains('domain_plans', $keys);
        $this->assertNotContains('domain_access', $keys);
        $this->assertSame([true], array_values(array_unique(array_map(fn (ToggleGroup $group) => $group->defaultEnabled, $switches))));
        $this->assertSame([[]], array_values(array_unique(array_map(fn (ToggleGroup $group) => $group->settings, $switches), SORT_REGULAR)));
        $this->assertSame($this->app->make(DomainSwitches::class)->of('Plans')->get(), $switches[array_search('domain_plans', $keys, true)]);
        $this->assertTrue($this->app->make(DomainSwitches::class)->of('Access')->isEmpty());
    }

    public function test_the_owner_switches_a_domain_off_with_the_ordinary_group_command(): void
    {
        $change = $this->app->make(CommandBus::class)->run(new DisableSettingGroup(new GroupReference('Core', 'domain_plans'), 0));

        $this->assertSame([1, SettingsOutcome::Changed], [$change->revision, $change->outcome]);
        $this->app->forgetScopedInstances();
        $this->assertInstanceOf(DisabledSettingsGroup::class, $this->app->make(SettingsResolver::class)->group($this->app->make(DomainSwitches::class)->of('Plans')->get()));
    }

    public function test_access_has_no_switch(): void
    {
        $this->expectException(SettingUnavailable::class);

        $this->app->make(CommandBus::class)->run(new DisableSettingGroup(new GroupReference('Core', 'domain_access'), 0));
    }

    public function test_core_settings_still_read_and_change_while_a_domain_is_off(): void
    {
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new DisableSettingGroup(new GroupReference('Core', 'domain_plans'), 0));

        $change = $bus->run(new SetStringSetting(new SettingReference('Core', 'display_name'), 'My journal', 1));
        $this->app->forgetScopedInstances();
        $core = $this->app->make(SettingRegistry::class)->definition('Core');
        $this->assertInstanceOf(CoreSettings::class, $core);

        $this->assertSame(SettingsOutcome::Changed, $change->outcome);
        $this->assertSame('My journal', $this->app->make(SettingsResolver::class)->string($core->displayName));
    }
}
