<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations;

use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;

/**
 * A declared page's reader: a header, a list of two books and an empty notice.
 */
final readonly class ShelfLayoutResolver implements PageResolver
{
    public function read(): DeclaredLayoutData
    {
        return DeclaredLayoutData::of(LayoutPartData::box(
            'shelf',
            'stack',
            LayoutPartData::text('title', 'Shelf', 'heading'),
            LayoutPartData::collection('books', 'list', [
                new LayoutRowData('book-1', 'Dune', 'read'),
                new LayoutRowData('book-2', 'Emma', 'unread'),
            ]),
            LayoutPartData::notice('none-lent', 'empty', 'No book is lent out'),
        ));
    }
}
