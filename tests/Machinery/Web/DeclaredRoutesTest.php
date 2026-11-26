<?php

declare(strict_types=1);

namespace Tests\Machinery\Web;

use App\Access\AccessSettings;
use App\Declarations\ActionRoute;
use App\Declarations\Page;
use App\Models\Access\User;
use App\Navigation\Enums\Icon;
use App\Profiles\Enums\SlotContextType;
use App\Support\ClientDeclarations;
use App\Support\DeclaredRoutes;
use App\Support\DomainEntry;
use App\Text\Declarations\Section;
use App\Web\Declarations\Slot;
use Illuminate\Routing\Router;
use Tests\Fixtures\ClientDeclarations\Desk\DeskDomain;
use Tests\Fixtures\ClientDeclarations\Desk\NotesResolver;
use Tests\Fixtures\ClientDeclarations\Desk\SaveDraft;
use Tests\Fixtures\ClientDeclarations\Library\AddBook;
use Tests\Fixtures\ClientDeclarations\Library\BooksResolver;
use Tests\Fixtures\ClientDeclarations\Library\LibraryDomain;
use Tests\Fixtures\ClientDeclarations\Library\NobodySees;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Web registers every declared page and action under its domain's prefix, behind sign-in and the visibility checks of
 * the page or section that owns it, and answers a hidden page exactly as a missing one.
 */
#[TestsMachinery(ClientDeclarations::class)]
final class DeclaredRoutesTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = $this->journal->owner()->ownerUser();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));

        $declarations = $this->declarations();
        $this->app->instance(ClientDeclarations::class, $declarations);
        $router = $this->app->make(Router::class);
        new DeclaredRoutes($declarations)->register($router);
        $router->getRoutes()->refreshNameLookups();
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

        $this->actingAs($this->owner)->get('/library')->assertOk();
        $this->actingAs($this->owner)->get('/library/hidden')->assertNotFound();
        $this->actingAs($this->owner)->post('/library/hidden/books')->assertNotFound();
        $this->journal->asGuest();
        $this->get('/library/hidden')->assertRedirect('/login');
    }

    private function declarations(): ClientDeclarations
    {
        $library = DomainEntry::fromClass(LibraryDomain::class)->declaring(pages: [
            Page::make('books', 'Books', Icon::Docs, BooksResolver::class, 'Books.vue')
                ->at('')
                ->slots(Slot::make('aside', SlotContextType::Nothing))
                ->actions(ActionRoute::post('books', AddBook::class, 'add')),
            Page::make('hidden', 'Hidden', Icon::Docs, BooksResolver::class, 'Books.vue')
                ->at('hidden')
                ->visibleWhen(NobodySees::class)
                ->actions(ActionRoute::post('hidden/books', AddBook::class, 'add-hidden')),
        ]);
        $desk = DomainEntry::fromClass(DeskDomain::class)->declaring(sections: [
            Section::make(
                'draft',
                'Draft',
                'library.aside',
                SlotContextType::Nothing,
                NotesResolver::class,
                'Notes.vue',
            )
                ->visibleWhen(NobodySees::class)
                ->actions(ActionRoute::post('drafts', SaveDraft::class, 'save')),
        ]);

        return ClientDeclarations::check([$library, $desk]);
    }
}
