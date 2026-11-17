<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\Declarations\ActionRoute;
use App\Domain\Declarations\DomainUi;
use App\Domain\Declarations\Page;
use App\Domain\Declarations\Section;
use App\Domain\Declarations\Slot;
use App\Domain\DomainEntry;
use App\Domain\Enums\Icon;
use App\Domain\Enums\SlotContextKind;
use App\Domain\UiDeclarations;
use App\Domain\Web\Exceptions\UiPrefixUnavailable;
use App\Domain\Web\Support\DeclaredRoutes;
use Illuminate\Routing\Route;
use Illuminate\Routing\RouteCollection;
use Illuminate\Routing\Router;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\UiDeclarations\Desk\DeskDomain;
use Tests\Fixtures\UiDeclarations\Desk\NotesReader;
use Tests\Fixtures\UiDeclarations\Desk\SaveDraft;
use Tests\Fixtures\UiDeclarations\Library\AddBook;
use Tests\Fixtures\UiDeclarations\Library\BooksReader;
use Tests\Fixtures\UiDeclarations\Library\LibraryDomain;
use Tests\Fixtures\UiDeclarations\Library\NobodySees;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Web registers every declared page and action under its domain's prefix, behind sign-in and the visibility checks of
 * the page or section that owns it, and answers a hidden page exactly as a missing one.
 */
final class DeclaredRoutesTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));

        $declarations = $this->declarations();
        $this->app->instance(UiDeclarations::class, $declarations);
        $router = $this->app->make(Router::class);
        new DeclaredRoutes($declarations)->register($router);
        $router->getRoutes()->refreshNameLookups();
    }

    public function test_a_declared_page_is_served_by_the_page_controller_under_its_domain_prefix(): void
    {
        $this->actingAs($this->owner)->get('/library')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('library/Books', false));

        $this->assertSame('/library/books', route('library.add', absolute: false));
    }

    public function test_a_hidden_page_answers_exactly_as_a_missing_one(): void
    {
        $hidden = $this->actingAs($this->owner)->get('/library/hidden')->assertNotFound();
        $missing = $this->actingAs($this->owner)->get('/library/nothing-here')->assertNotFound();

        $this->assertSame($missing->getContent(), $hidden->getContent());
    }

    public function test_a_guest_is_sent_to_sign_in_rather_than_told_the_page_is_missing(): void
    {
        $this->get('/library/hidden')->assertRedirect('/login');
    }

    public function test_an_action_runs_behind_its_page_and_a_section_action_behind_its_host_and_its_own_check(): void
    {
        $this->actingAs($this->owner)->post('/library/books')->assertOk()->assertSeeText('added');
        $this->actingAs($this->owner)->post('/library/hidden/books')->assertNotFound();
        $this->actingAs($this->owner)->post('/desk/drafts')->assertNotFound();
    }

    public function test_cached_routes_are_guarded_as_the_uncached_ones(): void
    {
        $router = $this->app->make(Router::class);
        $router->setCompiledRoutes($router->getRoutes()->compile());

        $this->get('/library/hidden')->assertRedirect('/login');
        $this->actingAs($this->owner)->get('/library')->assertOk();
        $this->actingAs($this->owner)->get('/library/hidden')->assertNotFound();
        $this->actingAs($this->owner)->post('/library/hidden/books')->assertNotFound();
    }

    public function test_a_prefix_another_route_uses_is_refused(): void
    {
        $routes = new RouteCollection;
        $routes->add(new Route(['GET'], 'library/old', fn () => 'old'));

        $this->expectExceptionObject(UiPrefixUnavailable::usedByRoute('library', 'library/old'));

        $this->declaredRoutes()->refuseTakenPrefixes($routes, public_path());
    }

    public function test_a_prefix_that_is_a_public_folder_is_refused(): void
    {
        $this->expectExceptionObject(UiPrefixUnavailable::usedByPublicFile('library'));

        $this->declaredRoutes()->refuseTakenPrefixes(new RouteCollection, dirname(__DIR__, 2).'/Fixtures/UiDeclarations/PublicFolder');
    }

    public function test_the_declared_routes_themselves_take_no_prefix(): void
    {
        $this->declaredRoutes()->refuseTakenPrefixes($this->app->make(Router::class)->getRoutes(), public_path());

        $this->addToAssertionCount(1);
    }

    private function declaredRoutes(): DeclaredRoutes
    {
        return new DeclaredRoutes($this->declarations());
    }

    private function declarations(): UiDeclarations
    {
        $library = DomainUi::declaring(DomainEntry::fromClass(LibraryDomain::class), pages: [
            Page::make('books', 'Books', Icon::Docs, BooksReader::class, 'Books.vue')
                ->at('')
                ->slots(Slot::make('aside', SlotContextKind::Nothing))
                ->actions(ActionRoute::post('books', AddBook::class, 'add')),
            Page::make('hidden', 'Hidden', Icon::Docs, BooksReader::class, 'Books.vue')
                ->at('hidden')
                ->visibleWhen(NobodySees::class)
                ->actions(ActionRoute::post('hidden/books', AddBook::class, 'add-hidden')),
        ]);
        $desk = DomainUi::declaring(DomainEntry::fromClass(DeskDomain::class), sections: [
            Section::make('draft', 'Draft', 'library.aside', SlotContextKind::Nothing, NotesReader::class, 'Notes.vue')
                ->visibleWhen(NobodySees::class)
                ->actions(ActionRoute::post('drafts', SaveDraft::class, 'save')),
        ]);

        return UiDeclarations::check([$library, $desk]);
    }
}
