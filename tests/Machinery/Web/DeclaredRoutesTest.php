<?php

declare(strict_types=1);

namespace Tests\Machinery\Web;

use App\Access\AccessSettings;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Declarations\PageSlots;
use App\Models\Access\User;
use App\Navigation\Enums\Icon;
use App\Profiles\Enums\SlotContextType;
use App\Support\ClientDeclarations;
use App\Support\DeclaredRoutes;
use App\Support\DomainEntry;
use App\Text\Declarations\Section;
use App\Web\Creation\DeclaredSurfaceCheck;
use Illuminate\Routing\Router;
use LogicException;
use Tests\Fixtures\ClientDeclarations\Desk\DeskDomain;
use Tests\Fixtures\ClientDeclarations\Desk\NotesResolver;
use Tests\Fixtures\ClientDeclarations\Desk\SaveDraft;
use Tests\Fixtures\ClientDeclarations\Library\AddBook;
use Tests\Fixtures\ClientDeclarations\Library\BookPageData;
use Tests\Fixtures\ClientDeclarations\Library\BooksPageData;
use Tests\Fixtures\ClientDeclarations\Library\Http\Pages\BookPageBuilder;
use Tests\Fixtures\ClientDeclarations\Library\Http\Pages\BooksPageBuilder;
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
        $surfaces = $this->app->make(DeclaredSurfaceCheck::class);

        foreach ($declarations->pages() as $page) {
            $surfaces->registerPage($page->owner, $page->key, $page->surface);
        }

        $this->app->bind(BookPageBuilder::class, static fn () => throw new LogicException('Hidden builder resolved.'));

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
            Page::build()
                ->key('books')
                ->title('Books')
                ->icon(Icon::Docs)
                ->pageType(BooksPageData::class)
                ->pageBuilder(BooksPageBuilder::class)
                ->component('Books.vue')
                ->finish()
                ->at('')
                ->slots(fn (PageSlots $slots) => $slots->add('aside', SlotContextType::Nothing))
                ->actions(fn (PageActions $actions) => $actions->post('books', AddBook::class, 'add')),
            Page::build()
                ->key('hidden')
                ->title('Hidden')
                ->icon(Icon::Docs)
                ->pageType(BookPageData::class)
                ->pageBuilder(BookPageBuilder::class)
                ->component('Books.vue')
                ->finish()
                ->at('hidden')
                ->visibleWhen(NobodySees::class)
                ->actions(fn (PageActions $actions) => $actions->post('hidden/books', AddBook::class, 'add-hidden')),
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
                ->actions(fn (PageActions $actions) => $actions->post('drafts', SaveDraft::class, 'save')),
        ]);

        return ClientDeclarations::check([$library, $desk]);
    }
}
