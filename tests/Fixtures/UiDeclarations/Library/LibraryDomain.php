<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Ui\Contracts\ProvidesNavigation;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Slot;
use App\Ui\Enums\Icon;
use App\Ui\Enums\SlotContextType;

/**
 * A fixture domain with a list page, a record page offering a slot, an action and nested navigation.
 */
final class LibraryDomain extends Domain implements ProvidesNavigation, ProvidesPages
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
            Page::make('books', 'Books', Icon::Docs, BooksReader::class, 'Books.vue')
                ->at('')
                ->onHome(10)
                ->slots(Slot::make('aside', SlotContextType::Session))
                ->actions(ActionRoute::post('books', AddBook::class, 'add')),
            Page::make('book', 'Book', Icon::Docs, BooksReader::class, 'Book/Reader.vue')
                ->at('{book}')
                ->inInspector()
                ->slots(Slot::record('book-inspector', 'book')),
        ];
    }

    public function navigation(): array
    {
        return [
            NavigationItem::page('books', 'Books', Icon::Docs, group: 'Work', position: 100)
                ->count(BookCount::class)
                ->children([
                    NavigationItem::page('first-book', 'First book', page: 'book', route: ['book' => '1']),
                    NavigationItem::heading('shelves', 'Shelves', childrenReader: ShelfItems::class),
                ]),
        ];
    }
}
