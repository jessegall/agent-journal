<?php

declare(strict_types=1);

namespace Tests\Routes;

use Inertia\Support\SessionKey;
use Inertia\Testing\AssertableInertia;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of GET login: a guest reaches it, its page is not encrypted in the history, and a sign-out leaves the
 * history to be cleared on the page it lands on.
 */
#[TestsRoute('GET', 'login')]
final class LoginGetTest extends GuardedRouteEntryTestCase
{
    public function test_a_guests_page_is_neither_encrypted_nor_cleared(): void
    {
        $this->get(route('login'))->assertInertia(function (AssertableInertia $page): void {
            $this->assertArrayNotHasKey('encryptHistory', $page->toArray());
            $this->assertArrayNotHasKey('clearHistory', $page->toArray());
        });
    }

    public function test_signing_out_clears_the_history_on_the_page_it_lands_on(): void
    {
        $this->journal->owner();

        $signedOut = $this->actingAs($this->journal->ownerUser())->post(route('logout'));

        $signedOut->assertRedirect('/')->assertSessionHas(SessionKey::CLEAR_HISTORY, true);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        return RouteCall::as(Caller::Guest);
    }
}
