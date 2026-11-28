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

    public function test_home_schedules_independent_copies_and_account_notices(): void
    {
        $journal = $this->journal->owner();
        $copy = 'window_web_asks__123456abcdef';
        $notices = 'section_web_bar_accounts_notices';

        $this->actingAs($journal->ownerUser())->get(route('home'))->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has('page')
                ->missing($copy)
                ->missing($notices)
                ->reloadOnly($copy, fn (AssertableInertia $same) => $same
                    ->where('title', 'Home')
                    ->where("{$copy}.status", 'ready')
                    ->where("{$copy}.data.items", [])
                    ->missing('page')
                    ->missing($notices))
                ->loadDeferredProps($notices, fn (AssertableInertia $later) => $later
                    ->where('title', 'Home')
                    ->where("{$notices}.status", 'ready')
                    ->missing($copy)
                    ->missing('page'))
                ->reload(
                    only: ['window_web_terminal', 'window_web_asks__invalid'],
                    callback: fn (AssertableInertia $forged) => $forged
                        ->where('title', 'Home')
                        ->missing('window_web_terminal')
                        ->missing('window_web_asks__invalid'),
                ),
        );
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
