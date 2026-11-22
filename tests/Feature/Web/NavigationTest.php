<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Domains\Support\DomainEntry;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\SidebarGroup;
use App\Ui\Enums\Icon;
use App\Ui\Support\UiDeclarations;
use App\Web\Data\NavigationData;
use App\Web\Data\NavigationGroupData;
use App\Web\Data\NavigationItemData;
use App\Web\Routes\DeclaredRoutes;
use App\Web\Support\NavigationRecords;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Tests\Fixtures\UiDeclarations\Library\BookCount;
use Tests\Fixtures\UiDeclarations\Library\BooksResolver;
use Tests\Fixtures\UiDeclarations\Library\LibraryDomain;
use Tests\Fixtures\UiDeclarations\Library\ListedChildren;
use Tests\Fixtures\UiDeclarations\Library\ListedNavigation;
use Tests\Fixtures\UiDeclarations\Library\NobodySees;
use Tests\Fixtures\UiDeclarations\Library\RevocableSight;
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
 * with its ancestors, a hidden item left out before its children or count are read, a failing count left out
 * without failing the rest, listed items that collide dropped, empty headings pruned, and one order whatever the
 * install order.
 */
final class NavigationTest extends TestCase
{
    use StartsAgentRequests;

    private ReaderCalls $calls;

    private ListedNavigation $listed;

    protected function setUp(): void
    {
        parent::setUp();

        $this->calls = new ReaderCalls();
        $this->listed = new ListedNavigation();
        $this->app->instance(ReaderCalls::class, $this->calls);
        $this->app->instance(ListedNavigation::class, $this->listed);
        $declarations = UiDeclarations::check([$this->library(), $this->shelf()]);
        $this->app->instance(UiDeclarations::class, $declarations);
        $router = $this->app->make(Router::class);
        new DeclaredRoutes($declarations)->register($router);
        $router->getRoutes()->refreshNameLookups();
        $this->startTestUserRequest(1);
    }

    public function test_static_and_record_children_come_with_their_urls_and_a_heading_links_its_first_child(): void
    {
        $tree = $this->navigation()->tree($this->requestTo('/library'));
        $books = $this->item($tree->navigationLinks, 'library.books');

        $this->assertSame('/library', $books->url);
        $this->assertSame(
            ['library.first-book', 'library.shelves'],
            array_map(fn (NavigationItemData $child) => $child->key, $books->children),
        );
        $this->assertSame('/library/1', $books->children[0]->url);
        $shelves = $books->children[1];
        $this->assertSame(
            ['library.shelf-1'],
            array_map(fn (NavigationItemData $child) => $child->key, $shelves->children),
        );
        $this->assertSame('/library/7', $shelves->url);
    }

    public function test_the_current_item_comes_with_its_ancestors(): void
    {
        $this->assertSame(
            ['library.books', 'library.first-book'],
            $this->navigation()->tree($this->requestTo('/library/1'))->current,
        );
        $this->assertSame(['library.books'], $this->navigation()->tree($this->requestTo('/library'))->current);
        $this->assertSame([], $this->navigation()->tree($this->requestTo('/shelf/5'))->current);
    }

    public function test_a_hidden_item_is_left_out_before_its_children_or_count_are_read(): void
    {
        $tree = $this->navigation()->tree($this->requestTo('/shelf'));
        $counts = $this->navigation()->counts();

        $this->assertSame(
            ['library.books', 'shelf.open'],
            array_map(fn (NavigationItemData $item) => $item->key, $tree->navigationLinks),
        );
        $this->assertSame([], $this->calls->readers);
        $this->assertArrayNotHasKey('shelf.secret', $counts->counts);
    }

    public function test_a_failing_count_is_left_out_without_failing_the_others(): void
    {
        $counts = $this->navigation()->counts();

        $this->assertSame(3, $counts->counts['library.books']);
        $this->assertArrayNotHasKey('shelf.open', $counts->counts);
    }

    public function test_a_listed_item_taking_a_declared_key_is_dropped_and_the_declared_one_stays(): void
    {
        $this->listed->children = [
            NavigationItem::page('first-book', 'A copy', page: 'book', route: ['book' => '2']),
            NavigationItem::page('second-book', 'Second book', page: 'book', route: ['book' => '2']),
        ];

        $tree = $this->navigation()->tree($this->requestTo('/library'));

        $this->assertSame(['library.second-book'], $this->childKeys($tree, 'library.listed'));
        $this->assertSame('/library/1', $this->item($tree->navigationLinks, 'library.books')->children[0]->url);
    }

    public function test_two_listed_items_with_one_key_are_both_dropped(): void
    {
        $this->listed->children = [
            NavigationItem::page('twin', 'One twin', page: 'book', route: ['book' => '2']),
            NavigationItem::page('twin', 'Other twin', page: 'book', route: ['book' => '3']),
            NavigationItem::page('single', 'Single', page: 'book', route: ['book' => '4']),
        ];

        $tree = $this->navigation()->tree($this->requestTo('/library'));

        $this->assertSame(['library.single'], $this->childKeys($tree, 'library.listed'));
    }

    public function test_a_listed_item_repeating_its_ancestor_is_dropped_without_reading_it_again(): void
    {
        $this->listed->children = [NavigationItem::heading('loop', 'Loop', childrenResolver: ListedChildren::class)];

        $tree = $this->navigation()->tree($this->requestTo('/library'));

        $this->assertSame(['library.books', 'shelf.open'], $this->rootKeys($tree));
    }

    public function test_a_heading_whose_last_child_is_hidden_disappears_with_it(): void
    {
        $this->listed->children = [
            NavigationItem::page('hidden', 'Hidden', page: 'book', route: ['book' => '2'])
                ->visibleWhen(NobodySees::class),
        ];

        $tree = $this->navigation()->tree($this->requestTo('/library'));

        $this->assertSame(['library.books', 'shelf.open'], $this->rootKeys($tree));
    }

    public function test_a_listed_item_is_counted_and_a_revoked_grant_removes_it_from_the_next_read(): void
    {
        $this->listed->children = [
            NavigationItem::page('counted', 'Counted', page: 'book', route: ['book' => '5'])
                ->count(BookCount::class)
                ->visibleWhen(RevocableSight::class),
        ];

        $this->assertSame(3, $this->navigation()->counts()->counts['library.counted']);
        $this->assertSame(
            ['library.listed', 'library.counted'],
            $this->navigation()->tree($this->requestTo('/library/5'))->current,
        );

        $this->listed->isRevoked = true;

        $this->assertArrayNotHasKey('library.counted', $this->navigation()->counts()->counts);
        $tree = $this->navigation()->tree($this->requestTo('/library/5'));
        $this->assertSame([], $tree->current);
        $this->assertSame(['library.books', 'shelf.open'], $this->rootKeys($tree));
    }

    public function test_the_current_item_is_the_deeper_one_of_equal_matches_and_the_lower_key_of_tied_siblings(): void
    {
        $this->listed->children = [
            NavigationItem::page('all-books', 'All books', page: 'books'),
            NavigationItem::page('b-eighth', 'Eighth', page: 'book', route: ['book' => '8']),
            NavigationItem::page('a-eighth', 'Eighth', page: 'book', route: ['book' => '8']),
        ];

        $this->assertSame(
            ['library.listed', 'library.all-books'],
            $this->navigation()->tree($this->requestTo('/library'))->current,
        );
        $this->assertSame(
            ['library.listed', 'library.a-eighth'],
            $this->navigation()->tree($this->requestTo('/library/8'))->current,
        );
        $this->assertSame(
            ['library.books', 'library.shelves', 'library.shelf-1'],
            $this->navigation()->tree($this->requestTo('/library/7'))->current,
        );
    }

    public function test_two_domains_share_one_group_in_one_order_whatever_the_install_order(): void
    {
        $tree = $this->navigation()->tree($this->requestTo('/library'));
        $this->app->instance(UiDeclarations::class, UiDeclarations::check([$this->shelf(), $this->library()]));
        $reversed = $this->navigation()->tree($this->requestTo('/library'));

        $this->assertSame(['library.books', 'shelf.open'], $this->rootKeys($tree));
        $this->assertSame($this->rootKeys($tree), $this->rootKeys($reversed));
        $this->assertEquals(
            [NavigationGroupData::from(['key' => 'library.work', 'label' => 'Work'])],
            $tree->groups,
        );
        $this->assertEquals($tree->groups, $reversed->groups);
    }

    public function test_two_groups_with_one_label_keep_their_own_keys_and_items(): void
    {
        $this->app->instance(
            UiDeclarations::class,
            UiDeclarations::check([$this->library(), $this->shelf(group: 'shelf.work')]),
        );

        $tree = $this->navigation()->tree($this->requestTo('/library'));

        $this->assertSame(
            [['library.work', 'Work'], ['shelf.work', 'Work']],
            array_map(fn (NavigationGroupData $group) => [$group->key, $group->label], $tree->groups),
        );
        $this->assertSame('library.work', $this->item($tree->navigationLinks, 'library.books')->group);
        $this->assertSame('shelf.work', $this->item($tree->navigationLinks, 'shelf.open')->group);
    }

    /**
     * @return list<string>
     */
    private function rootKeys(NavigationData $tree): array
    {
        return array_map(fn (NavigationItemData $item) => $item->key, $tree->navigationLinks);
    }

    /**
     * @return list<string>
     */
    private function childKeys(NavigationData $tree, string $key): array
    {
        return array_map(
            fn (NavigationItemData $child) => $child->key,
            $this->item($tree->navigationLinks, $key)->children,
        );
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

    private function library(): DomainUi
    {
        return DomainEntry::fromClass(LibraryDomain::class)->declaring(pages: [
            Page::make('books', 'Books', Icon::Docs, BooksResolver::class, 'Books.vue')->at(''),
            Page::make('book', 'Book', Icon::Docs, BooksResolver::class, 'Book/Reader.vue')->at('{book}'),
        ], navigation: [
            NavigationItem::page('books', 'Books', Icon::Docs, group: 'library.work', position: 100)
                ->count(BookCount::class)
                ->children([
                    NavigationItem::page('first-book', 'First book', page: 'book', route: ['book' => '1']),
                    NavigationItem::heading('shelves', 'Shelves', childrenResolver: ShelfItems::class),
                ]),
            NavigationItem::heading(
                'listed',
                'Listed',
                childrenResolver: ListedChildren::class,
                group: 'library.work',
                position: 400,
            ),
        ], sidebarGroups: [SidebarGroup::make('work', 'Work')]);
    }

    private function shelf(string $group = 'library.work'): DomainUi
    {
        return DomainEntry::fromClass(ShelfDomain::class)->declaring(pages: [
            Page::make('shelves', 'Shelves', Icon::Docs, ShelfResolver::class, 'Shelf.vue')->at(''),
            Page::make('shelf', 'Shelf', Icon::Docs, ShelfResolver::class, 'Record/Reader.vue')->at('{shelf}'),
        ], navigation: [
            NavigationItem::page(
                'open',
                'Open',
                Icon::Docs,
                page: 'shelves',
                group: $group,
                position: 200,
            )->count(BrokenCount::class),
            NavigationItem::page('secret', 'Secret', Icon::Docs, page: 'shelves', group: $group, position: 300)
                ->visibleWhen(NobodySees::class)
                ->childrenFrom(ShelfChildren::class)
                ->count(CountedShelves::class),
        ], sidebarGroups: [SidebarGroup::make('work', 'Work')]);
    }
}
