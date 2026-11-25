<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Contracts\Authorization\VisibilityCheck;
use App\Declarations\ActionRoute;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Declarations\RegisteredPage;
use App\Declarations\Section;
use App\Declarations\SidebarGroup;
use App\Declarations\Slot;
use App\Enums\Navigation\Icon;
use App\Enums\Profiles\SlotContextType;
use App\Exceptions\ClientComponentMissing;
use App\Exceptions\ClientKeyInvalid;
use App\Exceptions\ClientKeyRepeated;
use App\Exceptions\ClientPathInvalid;
use App\Exceptions\ClientPathRepeated;
use App\Exceptions\ClientResolverInvalid;
use App\Exceptions\ClientRouteConflict;
use App\Exceptions\ClientSlotMismatch;
use App\Exceptions\ClientSlotMissing;
use App\Exceptions\InvalidNavigationDeclaration;
use App\Support\ClientDeclarations;
use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\ClientDeclarations\Desk\DeskDomain;
use Tests\Fixtures\ClientDeclarations\Desk\NotesResolver;
use Tests\Fixtures\ClientDeclarations\Library\AddBook;
use Tests\Fixtures\ClientDeclarations\Library\BookCount;
use Tests\Fixtures\ClientDeclarations\Library\BooksRequest;
use Tests\Fixtures\ClientDeclarations\Library\BooksResolver;
use Tests\Fixtures\ClientDeclarations\Library\LibraryDomain;
use Tests\Fixtures\ClientDeclarations\Library\ShelfItems;
use Tests\Fixtures\ClientDeclarations\Library\TwoRequestsResolver;
use Tests\Fixtures\ClientDeclarations\RecentNotesData;
use Tests\Fixtures\Domains\Books\BooksDomain;

/**
 * The declarations of every installed domain are checked together at start-up and qualified with each domain's key.
 */
final class ClientDeclarationsTest extends TestCase
{
    public function test_installed_domains_contribute_qualified_pages_sections_actions_and_navigation(): void
    {
        $declarations = DomainRegistry::from(
            [LibraryDomain::class, DeskDomain::class, BooksDomain::class],
        )->clientDeclarations();

        [$books, $book] = $declarations->pages();
        $this->assertSame(
            ['library.books', 'library', 'window_library_books'],
            [$books->key, $books->uri, $books->propName],
        );
        $this->assertSame(
            ['library.book', 'library/{book}', ['book']],
            [$book->key, $book->uri, $book->path->parameters],
        );
        $this->assertSame(
            [BooksResolver::class, RecentNotesData::class, BooksRequest::class],
            [$books->resolver->resolver, $books->resolver->dataClass, $books->resolver->request],
        );
        $this->assertStringEndsWith('Library/Resources/js/pages/library/Book/Reader.vue', $book->componentFile);

        [$notes, $draft] = $declarations->sections();
        $this->assertSame(
            ['desk.notes', 'library.book', 'section_library_book_inspector_desk_notes'],
            [$notes->key, $notes->host->key, $notes->propName],
        );
        $this->assertSame('library.books', $draft->host->key);

        [$add] = $declarations->actions();
        $this->assertSame(
            ['library.add', 'library/books', 'library.books'],
            [$add->routeName, $add->uri, $add->guard->key],
        );

        [$root] = $declarations->navigation();
        $this->assertSame(['library.books', 'library.first-book', 'library.shelves'], $root->keys());
        $this->assertSame('library.book', $root->children[0]->page?->key);
        $this->assertNull($root->children[1]->page);
    }

    public function test_a_domain_that_declares_nothing_contributes_nothing(): void
    {
        $declarations = DomainRegistry::from([BooksDomain::class])->clientDeclarations();

        $this->assertSame(
            [[], [], [], []],
            [$declarations->pages(), $declarations->sections(), $declarations->actions(), $declarations->navigation()],
        );
    }

    public function test_dynamic_children_are_checked_like_declared_ones(): void
    {
        $declarations = DomainRegistry::from([LibraryDomain::class])->clientDeclarations();
        $shelves = $declarations->navigation()[0]->children[1];

        $children = $declarations->childrenOf($shelves, new ShelfItems()->children());

        $this->assertSame(['library.shelf-1'], array_map(fn ($child) => $child->key, $children));
        $this->expectExceptionObject(InvalidNavigationDeclaration::pageMissing('library.lost', 'library.lost'));

        $declarations->childrenOf($shelves, [NavigationItem::page('lost', 'Lost')]);
    }

    public function test_a_key_that_names_its_domain_is_refused(): void
    {
        $this->expectExceptionObject(ClientKeyInvalid::notLocal('Library', 'page', 'library.books'));

        $this->check(pages: [$this->page('library.books')]);
    }

    public function test_a_repeated_page_key_is_refused(): void
    {
        $this->expectExceptionObject(ClientKeyRepeated::inDomain('Library', 'page', 'books'));

        $this->check(pages: [$this->page('books'), $this->page('books')->at('other')]);
    }

    public function test_an_unnormalised_path_is_refused(): void
    {
        $this->expectExceptionObject(ClientPathInvalid::notNormalised('library.books', '/books/'));

        $this->check(pages: [$this->page('books')->at('/books/')]);
    }

    public function test_two_pages_answering_the_same_urls_are_refused(): void
    {
        $this->expectExceptionObject(ClientPathRepeated::for('library.one', 'library.two', 'GET', 'library/{}'));

        $this->check(pages: [$this->page('one')->at('{one}'), $this->page('two')->at('{two}')]);
    }

    public function test_an_action_named_like_a_page_is_refused(): void
    {
        $this->expectExceptionObject(ClientRouteConflict::nameRepeated('library.books'));

        $this->check(pages: [$this->page('books')->actions(ActionRoute::post('add', AddBook::class, 'books'))]);
    }

    public function test_a_component_outside_its_domain_is_refused(): void
    {
        $this->expectExceptionObject(
            ClientComponentMissing::outsideOwner('library.books', '../../../../Desk/Resources/js/pages/desk/Notes.vue'),
        );

        $this->check(
            pages: [
                Page::make('books', 'Books', Icon::Docs, BooksResolver::class, '../../../../Desk/Resources/js/pages/desk/Notes.vue'),
            ],
        );
    }

    public function test_a_missing_component_is_refused(): void
    {
        $this->expectException(ClientComponentMissing::class);

        $this->check(pages: [Page::make('books', 'Books', Icon::Docs, BooksResolver::class, 'Missing.vue')]);
    }

    public function test_a_reader_with_two_requests_is_refused(): void
    {
        $this->expectExceptionObject(ClientResolverInvalid::manyRequests('library.books', TwoRequestsResolver::class));

        $this->check(pages: [Page::make('books', 'Books', Icon::Docs, TwoRequestsResolver::class, 'Books.vue')]);
    }

    public function test_a_visibility_check_that_is_no_check_is_refused(): void
    {
        $this->expectExceptionObject(
            ClientResolverInvalid::notA('library.books', BookCount::class, VisibilityCheck::class),
        );

        $this->check(pages: [$this->page('books')->visibleWhen(BookCount::class)]);
    }

    public function test_navigation_route_values_must_fill_the_page_path_exactly(): void
    {
        $this->expectExceptionObject(
            InvalidNavigationDeclaration::routeValuesMismatch('library.first', 'library.book', '{book}'),
        );

        $this->check(
            pages: [$this->page('book')->at('{book}')],
            navigation: [NavigationItem::page('first', 'First', page: 'book')],
        );
    }

    public function test_a_root_joining_a_sidebar_group_nobody_declares_is_refused_until_its_owner_declares_it(): void
    {
        $books = NavigationItem::page('books', 'Books', group: 'library.work');

        try {
            $this->check(pages: [$this->page('books')->at('')], navigation: [$books]);
            $this->fail('A root joining an undeclared group was accepted.');
        } catch (InvalidNavigationDeclaration $refusal) {
            $this->assertEquals(InvalidNavigationDeclaration::groupMissing('library.books', 'library.work'), $refusal);
        }

        $declarations = ClientDeclarations::check([
            DomainEntry::fromClass(LibraryDomain::class)->declaring(
                pages: [$this->page('books')->at('')],
                navigation: [$books],
                sidebarGroups: [SidebarGroup::make('work', 'Work')],
            ),
        ]);

        $this->assertSame('Work', $declarations->sidebarGroup('library.work')->label);
    }

    public function test_a_section_for_a_slot_nobody_offers_is_refused(): void
    {
        $this->expectExceptionObject(ClientSlotMissing::for('library.notes', 'library.nowhere'));

        $this->check(
            sections: [
                Section::make(
                    'notes',
                    'Notes',
                    'library.nowhere',
                    SlotContextType::Nothing,
                    NotesResolver::class,
                    'Books.vue',
                ),
            ],
        );
    }

    public function test_a_section_taking_other_than_its_slot_is_refused(): void
    {
        $this->expectExceptionObject(ClientSlotMismatch::takes('desk.notes', 'library.aside', 'session', 'record'));

        $library = DomainEntry::fromClass(LibraryDomain::class)->client();
        $desk = DomainEntry::fromClass(DeskDomain::class)->declaring(sections: [
            Section::make(
                'notes',
                'Notes',
                'library.aside',
                SlotContextType::Record,
                NotesResolver::class,
                'Notes.vue',
            ),
        ]);

        ClientDeclarations::check([$library, $desk]);
    }

    public function test_a_record_slot_on_a_parameter_its_page_lacks_is_refused(): void
    {
        $this->expectExceptionObject(
            ClientSlotMismatch::parameterMissing('library.books', 'library.inspector', 'book'),
        );

        RegisteredPage::of(
            DomainEntry::fromClass(LibraryDomain::class)->declaring(),
            $this->page('books')->slots(Slot::record('inspector', 'book', 'book')),
        );
    }

    private function page(string $key): Page
    {
        return Page::make($key, 'Books', Icon::Docs, BooksResolver::class, 'Books.vue');
    }

    /**
     * @param  list<Page>  $pages
     * @param  list<NavigationItem>  $navigation
     * @param  list<Section>  $sections
     */
    private function check(array $pages = [], array $navigation = [], array $sections = []): ClientDeclarations
    {
        return ClientDeclarations::check(
            [DomainEntry::fromClass(LibraryDomain::class)->declaring($pages, $navigation, $sections)],
        );
    }
}
