<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The settings page shows the owner a group for each settings owner in one column, with the way into the connection
 * window that leads back to its own group, and shows no one else anything.
 */
final class SettingsPageTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_owner_sees_the_groups_and_the_way_into_the_connection_window(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));

        $this->actingAs($owner)->get('/settings')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('layout/DeclaredLayout')
            ->where('page.data.root.style', 'settings-page')
            ->where('page.data.root.children', fn ($groups) => collect($groups)->contains(
                fn ($group) => $group['key'] === 'connected-projects'
                    && str_contains(
                        $group['children'][1]['children'][1]['children'][1]['action']['href'] ?? '',
                        'return=',
                    ),
            )));
    }

    public function test_another_user_cannot_open_the_settings(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));

        $this->assertFalse($this->actingAs($other)->get('/settings')->isOk());
    }
}
