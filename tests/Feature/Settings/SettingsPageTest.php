<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The settings page shows the owner a section for each settings group in one column under its header, with the
 * Connected projects switch and the connect line with the connected projects inside that section, and shows no one
 * else anything.
 */
final class SettingsPageTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_owner_sees_the_groups_and_the_connected_projects_inside_their_section(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));

        config(['agents.server_origin' => 'https://journal.example.com']);

        $this->actingAs($owner)->get('/settings')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('layout/DeclaredLayout')
            ->where('page.data.root.style', 'page')
            ->where('page.data.root.children.1.children', fn ($groups) => collect($groups)->contains(
                fn ($group) => $group['key'] === 'connected_projects'
                    && str_contains((string) json_encode($group), 'connections\\/ConnectedProjectsPart')
                    && str_contains((string) json_encode($group), '"key":"switch"'),
            )));
    }

    public function test_a_journal_with_a_wrong_address_still_shows_settings_and_says_why_in_the_row(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        config(['agents.server_origin' => 'http://journal.example.com']);

        $this->actingAs($owner)->get('/settings')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.state', 'ready')
            ->where('page.data.root.children.1.children', fn ($groups) => collect($groups)->contains(
                fn ($group) => $group['key'] === 'connected_projects'
                    && str_contains((string) json_encode($group), 'JOURNAL_SERVER_ORIGIN'),
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
