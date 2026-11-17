<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use App\Core\Ui\Contracts\ProvidesNavigation;
use App\Core\Ui\Contracts\ProvidesPages;
use App\Core\Ui\Declarations\ActionRoute;
use App\Core\Ui\Declarations\NavigationItem;
use App\Core\Ui\Declarations\Page;
use App\Core\Ui\Declarations\Slot;
use App\Core\Ui\Enums\Icon;
use App\Core\Ui\Enums\SlotContextType;
use App\Domain\Contracts\Domain;

/**
 * A fixture domain with a list page, a record page offering a slot, an action and nested navigation.
 */
final class LibraryDomain implements Domain, ProvidesNavigation, ProvidesPages
{
    public function description(): string
    {
        return 'A fixture domain that declares pages and navigation.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): array
    {
        return [];
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
