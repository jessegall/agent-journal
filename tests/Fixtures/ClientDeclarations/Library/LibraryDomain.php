<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Declarations\PageSlots;
use App\Navigation\Contracts\NavigationProvider;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Contracts\SidebarGroupProvider;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Declarations\SidebarGroup;
use App\Navigation\Enums\Icon;
use App\Profiles\Enums\SlotContextType;
use App\Support\Domain;
use App\Support\Exports;
use Tests\Fixtures\ClientDeclarations\Library\BooksPaneData;
use Tests\Fixtures\ClientDeclarations\Library\Http\Pages\BookPageBuilder;
use Tests\Fixtures\ClientDeclarations\Library\Http\Pages\BooksPageBuilder;
use Tests\Fixtures\ClientDeclarations\Library\Http\Windows\BooksWindowBuilder;

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
            Page::build()
                ->key('books')
                ->title('Books')
                ->icon(Icon::Docs)
                ->pageType(BooksPageData::class)
                ->pageBuilder(BooksPageBuilder::class)
                ->component('Books.vue')
                ->withWindow(BooksPaneData::class, BooksWindowBuilder::class, 'BooksPane.vue')
                ->finish()
                ->at('')
                ->onHome(10)
                ->slots(fn (PageSlots $slots) => $slots->add('aside', SlotContextType::Session))
                ->actions(fn (PageActions $actions) => $actions->post('books', AddBook::class, 'add')),
            Page::build()
                ->key('book')
                ->title('Book')
                ->icon(Icon::Docs)
                ->pageType(BookPageData::class)
                ->pageBuilder(BookPageBuilder::class)
                ->component('Book/Reader.vue')
                ->finish()
                ->at('{book}')
                ->inInspector()
                ->slots(fn (PageSlots $slots) => $slots->record('book-inspector', 'book', 'book')),
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
