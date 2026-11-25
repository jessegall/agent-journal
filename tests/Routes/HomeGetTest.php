<?php

declare(strict_types=1);

namespace Tests\Routes;

use Inertia\Testing\AssertableInertia;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of GET home: the owner reaches it, and the page is kept encrypted in the browser's history.
 */
#[TestsRoute('GET', 'home')]
final class HomeGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_owners_page_is_kept_encrypted_in_the_history(): void
    {
        $this->journal->owner();

        $this->actingAs($this->journal->ownerUser())->get(route('home'))->assertInertia(
            fn (AssertableInertia $page) => $this->assertArrayHasKey('encryptHistory', $page->toArray()),
        );
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
