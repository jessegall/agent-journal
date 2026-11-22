<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The profiles page lists the owner's profiles on the shared list recipe, and tells an empty list from a failed one.
 */
final class ProfilesPageTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_with_no_profile_the_page_shows_an_informational_empty_state_and_nothing_selected(): void
    {
        // Starting an agent installs the built-in profiles, and a test that commits its rows may leave them behind.
        $this->emptyTables('profile_revisions', 'profiles');

        $this->actingAs($this->owner)->get('/accounts/profiles')->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('layout/DeclaredLayout')
                ->where('page.data.root.children.1.children.0.children.0.children.0.key', 'empty')
                ->where('page.data.root.children.1.children.0.children.0.children.0.style', 'empty')
                ->missing('page.data.root.children.1.children.1'),
        );
    }
}
