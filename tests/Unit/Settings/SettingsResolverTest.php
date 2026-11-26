<?php

declare(strict_types=1);

namespace Tests\Unit\Settings;

use App\Settings\Contracts\SettingsResolver as SettingsResolverContract;
use App\Settings\CoreSettings;
use App\Settings\Declarations\IntegerSetting;
use App\Settings\Exceptions\SettingHandleUnknown;
use App\Settings\SettingRegistry;
use App\Settings\SettingsResolver;
use App\Support\DomainRegistry;
use Tests\Fixtures\Domains\Reviews\ReviewsDomain;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
use Tests\Support\CountsReads;
use Tests\TestCase;

/**
 * The reader gives each setting its stored override or its default without an actor, reads each owner's record once
 * per request, reads a group that can be switched off only as a whole, and never turns a failure into a default.
 */
final class SettingsResolverTest extends TestCase
{
    use CountsReads;

    private SettingRegistry $registry;

    private CoreSettings $core;

    private ReviewSettings $reviews;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registry = DomainRegistry::from([ReviewsDomain::class])->settingDeclarations(new CoreSettings());
        $this->app->instance(SettingRegistry::class, $this->registry);
        $this->core = $this->registry->definition('Core');
        $this->reviews = $this->registry->definition('Reviews');
    }

    public function test_a_setting_built_outside_the_registered_definition_is_unknown(): void
    {
        $this->expectException(SettingHandleUnknown::class);

        $this->resolver()->integer(IntegerSetting::make('retry_limit', 'Retry limit', 3));
    }

    /**
     * The reader of a new request or job.
     */
    private function resolver(): SettingsResolver
    {
        $this->app->forgetScopedInstances();
        $resolver = $this->app->make(SettingsResolverContract::class);
        $this->assertInstanceOf(SettingsResolver::class, $resolver);

        return $resolver;
    }
}
