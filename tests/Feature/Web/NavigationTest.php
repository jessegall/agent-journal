<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Domains\Support\DomainEntry;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;
use App\Ui\Support\UiDeclarations;
use App\Web\Data\NavigationItemData;
use App\Web\Routes\DeclaredRoutes;
use App\Web\Support\NavigationRecords;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Tests\Fixtures\UiDeclarations\Library\BookCount;
use Tests\Fixtures\UiDeclarations\Library\BooksResolver;
use Tests\Fixtures\UiDeclarations\Library\LibraryDomain;
use Tests\Fixtures\UiDeclarations\Library\NobodySees;
use Tests\Fixtures\UiDeclarations\Library\ShelfItems;
use Tests\Fixtures\UiDeclarations\Shelf\BrokenCount;
use Tests\Fixtures\UiDeclarations\Shelf\CountedShelves;
use Tests\Fixtures\UiDeclarations\Shelf\ReaderCalls;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfChildren;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfDomain;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfResolver;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * The navigation a signed-in user sees: static and record children at any depth with their URLs, the current item
 * with its ancestors, a hidden item left out before its children or count are read, and a failing count left out
 * without failing the rest.
 */
final class NavigationTest extends TestCase
{
    use StartsAgentRequests;

    private ReaderCalls $calls;

    protected function setUp(): void
    {
        parent::setUp();

        $this->calls = new ReaderCalls();
        $this->app->instance(ReaderCalls::class, $this->calls);
        $declarations = $this->declarations();
        $this->app->instance(UiDeclarations::class, $declarations);
        $router = $this->app->make(Router::class);
        new DeclaredRoutes($declarations)->register($router);
        $router->getRoutes()->refreshNameLookups();
        $this->startTestUserRequest(1);
    }

    public function test_static_and_record_children_come_with_their_urls_and_a_heading_links_its_first_child(): void
    {
        $tree = $this->navigation()->tree($this->requestTo('/library'));
        $books = $this->item($tree->items, 'library.books');

        $this->assertSame('/library', $books->url);
        $this->assertSame(['library.first-book', 'library.shelves'], array_map(fn (NavigationItemData $child) => $child->key, $books->children));
        $this->assertSame('/library/1', $books->children[0]->url);
        $shelves = $books->children[1];
        $this->assertSame(['library.shelf-1'], array_map(fn (NavigationItemData $child) => $child->key, $shelves->children));
        $this->assertSame('/library/7', $shelves->url);
    }

    public function test_the_current_item_comes_with_its_ancestors(): void
    {
        $this->assertSame(['library.books', 'library.first-book'], $this->navigation()->tree($this->requestTo('/library/1'))->current);
        $this->assertSame(['library.books'], $this->navigation()->tree($this->requestTo('/library'))->current);
        $this->assertSame([], $this->navigation()->tree($this->requestTo('/shelf/5'))->current);
    }

    public function test_a_hidden_item_is_left_out_before_its_children_or_count_are_read(): void
    {
        $tree = $this->navigation()->tree($this->requestTo('/shelf'));
        $counts = $this->navigation()->counts();

        $this->assertSame(['library.books', 'shelf.open'], array_map(fn (NavigationItemData $item) => $item->key, $tree->items));
        $this->assertSame([], $this->calls->readers);
        $this->assertArrayNotHasKey('shelf.secret', $counts->counts);
    }

    public function test_a_failing_count_is_left_out_without_failing_the_others(): void
    {
        $counts = $this->navigation()->counts();

        $this->assertSame(3, $counts->counts['library.books']);
        $this->assertArrayNotHasKey('shelf.open', $counts->counts);
    }

    private function navigation(): NavigationRecords
    {
        return $this->app->make(NavigationRecords::class);
    }

    private function requestTo(string $path): Request
    {
        $request = Request::create($path);
        $route = $this->app->make(Router::class)->getRoutes()->match($request);
        $request->setRouteResolver(fn () => $route);

        return $request;
    }

    /**
     * @param  list<NavigationItemData>  $items
     */
    private function item(array $items, string $key): NavigationItemData
    {
        return array_values(array_filter($items, fn (NavigationItemData $item) => $item->key === $key))[0];
    }

    private function declarations(): UiDeclarations
    {
        $library = DomainEntry::fromClass(LibraryDomain::class)->declaring(pages: [
            Page::make('books', 'Books', Icon::Docs, BooksResolver::class, 'Books.vue')->at(''),
            Page::make('book', 'Book', Icon::Docs, BooksResolver::class, 'Book/Reader.vue')->at('{book}'),
        ], navigation: [
            NavigationItem::page('books', 'Books', Icon::Docs, group: 'Work', position: 100)
                ->count(BookCount::class)
                ->children([
                    NavigationItem::page('first-book', 'First book', page: 'book', route: ['book' => '1']),
                    NavigationItem::heading('shelves', 'Shelves', childrenResolver: ShelfItems::class),
                ]),
        ]);
        $shelf = DomainEntry::fromClass(ShelfDomain::class)->declaring(pages: [
            Page::make('shelves', 'Shelves', Icon::Docs, ShelfResolver::class, 'Shelf.vue')->at(''),
            Page::make('shelf', 'Shelf', Icon::Docs, ShelfResolver::class, 'Record/Reader.vue')->at('{shelf}'),
        ], navigation: [
            NavigationItem::page('open', 'Open', Icon::Docs, page: 'shelves', group: 'Work', position: 200)->count(BrokenCount::class),
            NavigationItem::page('secret', 'Secret', Icon::Docs, page: 'shelves', group: 'Work', position: 300)
                ->visibleWhen(NobodySees::class)
                ->childrenFrom(ShelfChildren::class)
                ->count(CountedShelves::class),
        ]);

        return UiDeclarations::check([$library, $shelf]);
    }
}
