<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Actors\Contracts\Actor;
use App\Agents\Models\Agent;
use App\Settings\Contracts\SettingsAccessPolicy;
use App\Settings\Exceptions\SettingsAccessDenied;
use App\Settings\Providers\SettingsServiceProvider;
use App\Settings\Support\ClosedSettingsAccess;
use App\Web\Support\OwnerSettingsAccess;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Foundation\Application;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Settings deny everyone until Web binds the owner policy, whichever provider registers first; the owner policy lets
 * in only the journal's configured owner.
 */
final class SettingsAccessTest extends TestCase
{
    use RefreshHookDatabase;

    private const string DENIAL = 'You may not read or change the settings.';

    public function test_the_application_uses_the_owner_policy(): void
    {
        $this->assertInstanceOf(OwnerSettingsAccess::class, $this->app->make(SettingsAccessPolicy::class));
    }

    public function test_without_web_nobody_is_let_in(): void
    {
        $application = new Application($this->app->basePath());
        new SettingsServiceProvider($application)->register();

        $policy = $application->make(SettingsAccessPolicy::class);

        $this->assertInstanceOf(ClosedSettingsAccess::class, $policy);
        $this->assertFalse($policy->allows(User::factory()->create()));
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

    public function test_only_the_configured_owner_user_is_let_in(): void
    {
        $owner = User::factory()->create();
        $agent = Agent::create('Planner', 'main-agent');
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $policy = $this->app->make(SettingsAccessPolicy::class);

        $this->assertTrue($policy->allows($owner));
        $this->assertFalse($policy->allows(User::factory()->create()));
        $this->assertFalse($policy->allows($agent));
    }

    public function test_the_refusal_names_no_owner_or_setting(): void
    {
        $this->assertSame(self::DENIAL, SettingsAccessDenied::forActor()->getMessage());
    }

    public function test_nobody_is_let_in_while_no_owner_is_configured(): void
    {
        $user = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings(null));

        $this->assertFalse($this->app->make(SettingsAccessPolicy::class)->allows($user));
    }
}
