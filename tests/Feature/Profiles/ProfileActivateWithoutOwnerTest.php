<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Console\Commands\ProfileActivateCommand;
use App\Models\Profiles\Profile;
use App\Support\Access\AccessSettings;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An install on a journal whose owner has not signed up yet, such as one whose database was just rebuilt, goes on:
 * profile:activate says why it activates nothing and succeeds, so the rest of the install runs.
 */
final class ProfileActivateWithoutOwnerTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_with_no_owner_yet_activation_says_why_it_waits_and_succeeds(): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings(null));
        $this->emptyTables('profile_revisions', 'profiles');

        $this->artisan('profile:activate')
            ->expectsOutput(ProfileActivateCommand::NO_OWNER_YET)
            ->assertSuccessful();

        $this->assertSame(0, Profile::query()->count());
    }
}
