<?php

declare(strict_types=1);

namespace Tests\Routes\Scripts;

use Inertia\Testing\AssertableInertia;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the script editor of one profile; a user it is hidden from is refused.
 */
#[TestsRoute('GET', 'scripts.profile-script')]
final class ProfileScriptGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_script_result_uses_the_profile_in_the_route(): void
    {
        $owner = $this->journal->owner()->installProfiles()->ownerUser();

        $this->actingAs($owner)
            ->get(route('scripts.profile-script', ['profile' => 'draft-test']).'?profile=ignored')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.status', 'ready')
                ->where('page.data.draft.profile', 'draft-test'));
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');

        return RouteCall::as(Caller::User)
            ->parameters([
                'profile' => 'draft-test',
            ])
            ->hiddenFrom('Member');
    }
}
