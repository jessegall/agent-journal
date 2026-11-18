<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Domains\Support\DomainEntry;
use App\Domains\Support\DomainRegistry;
use App\Ui\Contracts\VisibilityCheck;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\RegisteredPage;
use App\Ui\Declarations\Section;
use App\Ui\Declarations\Slot;
use App\Ui\Enums\Icon;
use App\Ui\Enums\SlotContextType;
use App\Ui\Exceptions\InvalidNavigationDeclaration;
use App\Ui\Exceptions\UiComponentMissing;
use App\Ui\Exceptions\UiKeyInvalid;
use App\Ui\Exceptions\UiKeyRepeated;
use App\Ui\Exceptions\UiPathInvalid;
use App\Ui\Exceptions\UiPathRepeated;
use App\Ui\Exceptions\UiReaderInvalid;
use App\Ui\Exceptions\UiRouteConflict;
use App\Ui\Exceptions\UiSlotMismatch;
use App\Ui\Exceptions\UiSlotMissing;
use App\Ui\Support\UiDeclarations;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Domains\Books\BooksDomain;
use Tests\Fixtures\UiDeclarations\Desk\DeskDomain;
use Tests\Fixtures\UiDeclarations\Desk\NotesReader;
use Tests\Fixtures\UiDeclarations\Library\AddBook;
use Tests\Fixtures\UiDeclarations\Library\BookCount;
use Tests\Fixtures\UiDeclarations\Library\BooksReader;
use Tests\Fixtures\UiDeclarations\Library\BooksRequest;
use Tests\Fixtures\UiDeclarations\Library\LibraryDomain;
use Tests\Fixtures\UiDeclarations\Library\ShelfItems;
use Tests\Fixtures\UiDeclarations\Library\TwoRequestsReader;
use Tests\Fixtures\UiDeclarations\RecentNotesData;

/**
 * The declarations of every installed domain are checked together at start-up and qualified with each domain's key.
 */
final class UiDeclarationsTest extends TestCase
{
    public function test_installed_domains_contribute_qualified_pages_sections_actions_and_navigation(): void
    {
        $declarations = DomainRegistry::from([LibraryDomain::class, DeskDomain::class, BooksDomain::class])->uiDeclarations();

        [$books, $book] = $declarations->pages();
        $this->assertSame(['library.books', 'library', 'window_library_books'], [$books->key, $books->uri, $books->propName]);
        $this->assertSame(['library.book', 'library/{book}', ['book']], [$book->key, $book->uri, $book->path->parameters]);
        $this->assertSame([BooksReader::class, RecentNotesData::class, BooksRequest::class], [$books->reader->reader, $books->reader->dataClass, $books->reader->request]);
        $this->assertStringEndsWith('Library/Resources/js/Book/Reader.vue', $book->componentFile);

        [$notes, $draft] = $declarations->sections();
        $this->assertSame(['desk.notes', 'library.book', 'section_library_book_inspector_desk_notes'], [$notes->key, $notes->host->key, $notes->propName]);
        $this->assertSame('library.books', $draft->host->key);

        [$add] = $declarations->actions();
        $this->assertSame(['library.add', 'library/books', 'library.books'], [$add->routeName, $add->uri, $add->guard->key]);

        [$root] = $declarations->navigation();
        $this->assertSame(['library.books', 'library.first-book', 'library.shelves'], $root->keys());
        $this->assertSame('library.book', $root->children[0]->page?->key);
        $this->assertNull($root->children[1]->page);
    }

    public function test_a_domain_that_declares_nothing_contributes_nothing(): void
    {
        $declarations = DomainRegistry::from([BooksDomain::class])->uiDeclarations();

        $this->assertSame([[], [], [], []], [$declarations->pages(), $declarations->sections(), $declarations->actions(), $declarations->navigation()]);
    }

    public function test_dynamic_children_are_checked_like_declared_ones(): void
    {
        $declarations = DomainRegistry::from([LibraryDomain::class])->uiDeclarations();
        $shelves = $declarations->navigation()[0]->children[1];

        $children = $declarations->childrenOf($shelves, new ShelfItems()->children());

        $this->assertSame(['library.shelf-1'], array_map(fn ($child) => $child->key, $children));
        $this->expectExceptionObject(InvalidNavigationDeclaration::pageMissing('library.lost', 'library.lost'));

        $declarations->childrenOf($shelves, [NavigationItem::page('lost', 'Lost')]);
    }

    public function test_a_key_that_names_its_domain_is_refused(): void
    {
        $this->expectExceptionObject(UiKeyInvalid::notLocal('Library', 'page', 'library.books'));

        $this->check(pages: [$this->page('library.books')]);
    }

    public function test_a_repeated_page_key_is_refused(): void
    {
        $this->expectExceptionObject(UiKeyRepeated::inDomain('Library', 'page', 'books'));

        $this->check(pages: [$this->page('books'), $this->page('books')->at('other')]);
    }

    public function test_an_unnormalised_path_is_refused(): void
    {
        $this->expectExceptionObject(UiPathInvalid::notNormalised('library.books', '/books/'));

        $this->check(pages: [$this->page('books')->at('/books/')]);
    }

    public function test_two_pages_answering_the_same_urls_are_refused(): void
    {
        $this->expectExceptionObject(UiPathRepeated::for('library.one', 'library.two', 'GET', 'library/{}'));

        $this->check(pages: [$this->page('one')->at('{one}'), $this->page('two')->at('{two}')]);
    }

    public function test_an_action_named_like_a_page_is_refused(): void
    {
        $this->expectExceptionObject(UiRouteConflict::nameRepeated('library.books'));

        $this->check(pages: [$this->page('books')->actions(ActionRoute::post('add', AddBook::class, 'books'))]);
    }

    public function test_a_component_outside_its_domain_is_refused(): void
    {
        $this->expectExceptionObject(UiComponentMissing::outsideOwner('library.books', '../../Desk/Resources/js/Notes.vue'));

        $this->check(pages: [Page::make('books', 'Books', Icon::Docs, BooksReader::class, '../../Desk/Resources/js/Notes.vue')]);
    }

    public function test_a_missing_component_is_refused(): void
    {
        $this->expectException(UiComponentMissing::class);

        $this->check(pages: [Page::make('books', 'Books', Icon::Docs, BooksReader::class, 'Missing.vue')]);
    }

    public function test_a_reader_with_two_requests_is_refused(): void
    {
        $this->expectExceptionObject(UiReaderInvalid::manyRequests('library.books', TwoRequestsReader::class));

        $this->check(pages: [Page::make('books', 'Books', Icon::Docs, TwoRequestsReader::class, 'Books.vue')]);
    }

    public function test_a_visibility_check_that_is_no_check_is_refused(): void
    {
        $this->expectExceptionObject(UiReaderInvalid::notA('library.books', BookCount::class, VisibilityCheck::class));

        $this->check(pages: [$this->page('books')->visibleWhen(BookCount::class)]);
    }

    public function test_navigation_route_values_must_fill_the_page_path_exactly(): void
    {
        $this->expectExceptionObject(InvalidNavigationDeclaration::routeValuesMismatch('library.first', 'library.book', '{book}'));

        $this->check(
            pages: [$this->page('book')->at('{book}')],
            navigation: [NavigationItem::page('first', 'First', page: 'book')],
        );
    }

    public function test_a_section_for_a_slot_nobody_offers_is_refused(): void
    {
        $this->expectExceptionObject(UiSlotMissing::for('library.notes', 'library.nowhere'));

        $this->check(sections: [Section::make('notes', 'Notes', 'library.nowhere', SlotContextType::Nothing, NotesReader::class, 'Books.vue')]);
    }

    public function test_a_section_taking_other_than_its_slot_is_refused(): void
    {
        $this->expectExceptionObject(UiSlotMismatch::takes('desk.notes', 'library.aside', 'session', 'record'));

        $library = DomainEntry::fromClass(LibraryDomain::class)->ui();
        $desk = DomainEntry::fromClass(DeskDomain::class)->declaring(sections: [
            Section::make('notes', 'Notes', 'library.aside', SlotContextType::Record, NotesReader::class, 'Notes.vue'),
        ]);

        UiDeclarations::check([$library, $desk]);
    }

    public function test_a_record_slot_on_a_parameter_its_page_lacks_is_refused(): void
    {
        $this->expectExceptionObject(UiSlotMismatch::parameterMissing('library.books', 'library.inspector', 'book'));

        RegisteredPage::of(
            DomainEntry::fromClass(LibraryDomain::class)->declaring(),
            $this->page('books')->slots(Slot::record('inspector', 'book')),
        );
    }

    private function page(string $key): Page
    {
        return Page::make($key, 'Books', Icon::Docs, BooksReader::class, 'Books.vue');
    }

    /**
     * @param  list<Page>  $pages
     * @param  list<NavigationItem>  $navigation
     * @param  list<Section>  $sections
     */
    private function check(array $pages = [], array $navigation = [], array $sections = []): UiDeclarations
    {
        return UiDeclarations::check([DomainEntry::fromClass(LibraryDomain::class)->declaring($pages, $navigation, $sections)]);
    }
}
