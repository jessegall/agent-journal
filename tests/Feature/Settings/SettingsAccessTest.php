<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Contracts\Actors\Actor;
use App\Contracts\Settings\SettingsAccessPolicy;
use App\Exceptions\SettingsAccessDenied;
use App\Providers\SettingsServiceProvider;
use App\Support\OwnerSettingsAccess;
use Illuminate\Foundation\Application;
use Tests\TestCase;

/**
 * Settings deny everyone until Web binds the owner policy, whichever provider registers first; the owner policy lets
 * in only the journal's configured owner.
 */
final class SettingsAccessTest extends TestCase
{
    private const string DENIAL = 'You may not read or change the settings.';

    public function test_the_application_uses_the_owner_policy(): void
    {
        $this->assertInstanceOf(OwnerSettingsAccess::class, $this->app->make(SettingsAccessPolicy::class));
    }

    public function test_a_policy_bound_before_settings_registers_is_kept(): void
    {
        $application = new Application($this->app->basePath());

        $allowsEveryone = new class implements SettingsAccessPolicy
        {
            public function allows(Actor $actor): bool
            {
                return true;
            }
        };

        $application->instance(SettingsAccessPolicy::class, $allowsEveryone);
        new SettingsServiceProvider($application)->register();

        $this->assertSame($allowsEveryone, $application->make(SettingsAccessPolicy::class));
    }

    public function test_the_refusal_names_no_owner_or_setting(): void
    {
        $this->assertSame(self::DENIAL, SettingsAccessDenied::forActor()->getMessage());
    }
}
