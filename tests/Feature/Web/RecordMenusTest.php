<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Contracts\Navigation\RecordMenus;
use App\Declarations\DomainUi;
use App\Declarations\Menu;
use App\Declarations\MenuItem;
use App\Declarations\Page;
use App\Enums\ActionMethod;
use App\Enums\Icon;
use App\Exceptions\InvalidMenuDeclaration;
use App\Support\DeclaredRoutes;
use App\Support\DomainEntry;
use App\Support\Layout\LayoutMenuData;
use App\Support\Layout\LayoutMenuGroupData;
use App\Support\Layout\LayoutMenuItemData;
use App\Support\UiDeclarations;
use Illuminate\Routing\Router;
use Tests\Fixtures\UiDeclarations\Library\BooksResolver;
use Tests\Fixtures\UiDeclarations\Library\LibraryDomain;
use Tests\Fixtures\UiDeclarations\Library\NobodySees;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfDomain;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfResolver;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A menu one domain exports and two domains fill: its items bound to the record it is opened on, a hidden item left
 * out, groups and items in one order whatever the install order, and an item that targets a missing menu or a route
 * that does not take the menu's record refused at start-up.
 */
final class RecordMenusTest extends TestCase
{
    use StartsAgentRequests;

    protected function setUp(): void
    {
        parent::setUp();

        $this->install([$this->library(), $this->shelf()]);
        $this->startTestUserRequest(1);
    }

    public function test_the_same_menu_on_two_records_binds_each_records_own_values(): void
    {
        $first = $this->menus()->onRecord('library.book-actions', '1');
        $second = $this->menus()->onRecord('library.book-actions', '2');

        $this->assertSame('/library/1?tab=notes', $this->item($first, 'library.notes')->href);
        $this->assertSame('/library/2?tab=notes', $this->item($second, 'library.notes')->href);
        $this->assertSame('/shelf/books/2', $this->item($second, 'shelf.shelve')->href);
        $this->assertSame(ActionMethod::Get, $this->item($second, 'shelf.shelve')->method);
    }

    public function test_a_hidden_item_is_left_out_and_groups_keep_one_order_whatever_the_install_order(): void
    {
        $menu = $this->menus()->onRecord('library.book-actions', '1');
        $this->install([$this->shelf(), $this->library()]);
        $reversed = $this->menus()->onRecord('library.book-actions', '1');

        $this->assertSame([['library.notes', 'shelf.shelve'], ['library.read']], $this->keys($menu));
        $this->assertSame($this->keys($menu), $this->keys($reversed));
    }

    public function test_an_item_joining_a_missing_menu_is_refused(): void
    {
        $this->expectExceptionObject(
            InvalidMenuDeclaration::menuMissing('Shelf', 'shelf.shelve', 'library.book-actions'),
        );

        UiDeclarations::check([$this->shelf()]);
    }

    public function test_an_item_whose_route_does_not_take_the_menus_record_is_refused(): void
    {
        $this->expectExceptionObject(
            InvalidMenuDeclaration::contextMismatch('library.all', 'library.book-actions', ''),
        );

        UiDeclarations::check([
            DomainEntry::fromClass(LibraryDomain::class)->declaring(
                pages: $this->libraryPages(),
                menus: [Menu::record('book-actions', 'Book actions', 'book')],
                menuItems: [MenuItem::opens('all', 'All books', 'library.book-actions', 'books')],
            ),
        ]);
    }

    private function menus(): RecordMenus
    {
        return $this->app->make(RecordMenus::class);
    }

    /**
     * @param  list<DomainUi>  $domains
     */
    private function install(array $domains): void
    {
        $declarations = UiDeclarations::check($domains);
        $this->app->instance(UiDeclarations::class, $declarations);
        $router = $this->app->make(Router::class);
        new DeclaredRoutes($declarations)->register($router);
        $router->getRoutes()->refreshNameLookups();
    }

    private function item(LayoutMenuData $menu, string $key): LayoutMenuItemData
    {
        foreach ($menu->groups as $group) {
            foreach ($group->items as $item) {
                if ($item->key === $key) {
                    return $item;
                }
            }
        }

        $this->fail("The menu has no item {$key}.");
    }

    /**
     * @return list<list<string>>
     */
    private function keys(LayoutMenuData $menu): array
    {
        return array_map(
            fn (LayoutMenuGroupData $group) => array_map(fn (LayoutMenuItemData $item) => $item->key, $group->items),
            $menu->groups,
        );
    }

    /**
     * @return list<Page>
     */
    private function libraryPages(): array
    {
        return [
            Page::make('books', 'Books', Icon::Docs, BooksResolver::class, 'Books.vue')->at(''),
            Page::make('book', 'Book', Icon::Docs, BooksResolver::class, 'Book/Reader.vue')->at('{book}'),
        ];
    }

    private function library(): DomainUi
    {
        return DomainEntry::fromClass(LibraryDomain::class)->declaring(
            pages: $this->libraryPages(),
            menus: [Menu::record('book-actions', 'Book actions', 'book')],
            menuItems: [
                MenuItem::opens('read', 'Read', 'library.book-actions', 'book')->inGroup('reading', 20),
                MenuItem::opens('notes', 'Notes', 'library.book-actions', 'book', ['tab' => 'notes'])
                    ->inGroup('open', 10),
                MenuItem::opens('secret', 'Secret', 'library.book-actions', 'book')
                    ->inGroup('open', 5)
                    ->visibleWhen(NobodySees::class),
            ],
        );
    }

    private function shelf(): DomainUi
    {
        return DomainEntry::fromClass(ShelfDomain::class)->declaring(
            pages: [
                Page::make('shelves', 'Shelves', Icon::Docs, ShelfResolver::class, 'Shelf.vue')->at(''),
                Page::make('shelve', 'Shelve', Icon::Docs, ShelfResolver::class, 'Record/Reader.vue')
                    ->at('books/{book}'),
            ],
            menuItems: [MenuItem::opens('shelve', 'Shelve', 'library.book-actions', 'shelve')->inGroup('open', 10)],
        );
    }
}
