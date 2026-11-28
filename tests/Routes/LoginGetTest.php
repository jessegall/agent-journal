<?php

declare(strict_types=1);

namespace Tests\Routes;

use App\CorePages;
use App\Pages\LoginPage;
use App\Web\Creation\PageFactory;
use Illuminate\Http\Request;
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
    public function test_login_prefill_depends_on_the_local_environment_and_stays_out_of_shell_declarations(): void
    {
        $declaration = CorePages::login();
        $factory = new PageFactory($this->app);
        $factory->register($declaration->type, $declaration->builder);
        $visit = Request::create('/login?email=ignored');
        $this->assertSame('', $factory->create(LoginPage::class, $visit)->input->email);
        foreach (CorePages::declarations() as $owner) {
            $this->assertNotContains('Login', array_column($owner->pages, 'component'));
        }

        $this->app['env'] = 'local';
        $this->app['config']->set('journal.web.local_sign_in.email', 'sample@example.test');
        $this->app['config']->set('journal.web.local_sign_in.password', 'local-test-password');

        $this->assertSame('sample@example.test', $factory->create(LoginPage::class, $visit)->input->email);
    }

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
