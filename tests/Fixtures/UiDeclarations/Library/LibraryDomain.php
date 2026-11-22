<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use App\Support\Domain;
use App\Support\Exports;
use App\Contracts\Navigation\NavigationProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Navigation\SidebarGroupProvider;
use App\Declarations\ActionRoute;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Declarations\SidebarGroup;
use App\Declarations\Slot;
use App\Enums\Icon;
use App\Enums\SlotContextType;

/**
 * A fixture domain with a list page, a record page offering a slot, an action, nested navigation and its own sidebar
 * group.
 */
final class LibraryDomain extends Domain implements NavigationProvider, PageProvider, SidebarGroupProvider
{
    public function description(): string
    {
        return 'A fixture domain that declares pages and navigation.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }

    public function pages(): array
    {
        return [
            Page::make('books', 'Books', Icon::Docs, BooksResolver::class, 'Books.vue')
                ->at('')
                ->onHome(10)
                ->slots(Slot::make('aside', SlotContextType::Session))
                ->actions(ActionRoute::post('books', AddBook::class, 'add')),
            Page::make('book', 'Book', Icon::Docs, BooksResolver::class, 'Book/Reader.vue')
                ->at('{book}')
                ->inInspector()
                ->slots(Slot::record('book-inspector', 'book', 'book')),
        ];
    }

    public function sidebarGroups(): array
    {
        return [SidebarGroup::make('work', 'Work')];
    }

    public function navigation(): array
    {
        return [
            NavigationItem::page('books', 'Books', Icon::Docs, group: 'library.work', position: 100)
                ->count(BookCount::class)
                ->children([
                    NavigationItem::page('first-book', 'First book', page: 'book', route: ['book' => '1']),
                    NavigationItem::heading('shelves', 'Shelves', childrenResolver: ShelfItems::class),
                ]),
        ];
    }
}
