<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Domains\Support\DomainRegistry;
use App\Settings\Contracts\GroupDeclaration;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Support\CoreSettings;
use App\Settings\Support\SettingRegistry;
use Tests\Fixtures\Domains\BadSettings\BadSettingsDomain;
use Tests\Fixtures\Domains\Library\LibraryDomain;
use Tests\Fixtures\Domains\Library\LibrarySettings;
use Tests\Fixtures\Domains\Reviews\ReviewsDomain;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
use Tests\TestCase;

/**
 * A domain's settings are collected once from its Domain class, registered under the domain's name beside Core's,
 * and the registered definition is the object the container hands out.
 */
final class DomainSettingsTest extends TestCase
{
    public function test_a_domain_declaring_settings_is_registered_under_its_name_built_once(): void
    {
        LibrarySettings::$built = 0;
        $registry = DomainRegistry::from([LibraryDomain::class])->settingDeclarations(new CoreSettings);

        $this->assertSame(['Core', 'Library'], array_keys($registry->definitions()));
        $this->assertInstanceOf(LibrarySettings::class, $registry->definition('Library'));
        $this->assertSame(1, LibrarySettings::$built);
    }

    public function test_a_domain_declaring_every_type_registers_both_kinds_of_group(): void
    {
        $registry = DomainRegistry::from([ReviewsDomain::class])->settingDeclarations(new CoreSettings);
        $reviews = $registry->definition('Reviews');

        $this->assertInstanceOf(ReviewSettings::class, $reviews);
        $this->assertSame(['general', 'review'], array_map(fn (GroupDeclaration $group) => $group->key(), $reviews->groups()));
        $this->assertTrue($registry->isInToggleGroup($reviews->reviewMode));
        $this->assertFalse($registry->isInToggleGroup($reviews->title));
        $this->assertSame('Reviews', $registry->ownerOf($reviews->review)->owner);
    }

    public function test_a_domain_with_a_bad_setting_key_stops_registration(): void
    {
        $this->expectException(SettingDeclarationInvalid::class);
        $this->expectExceptionMessage('Greeting');

        DomainRegistry::from([BadSettingsDomain::class]);
    }

    public function test_the_container_hands_out_the_registered_core_definition(): void
    {
        $registry = $this->app->make(SettingRegistry::class);
        $core = $this->app->make(CoreSettings::class);

        $this->assertSame($registry->definition('Core'), $core);
        $this->assertSame('display_name', $registry->ownerOf($core->displayName)->key);
    }
}
