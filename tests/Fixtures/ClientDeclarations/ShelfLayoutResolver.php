<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations;

use App\Navigation\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;

/**
 * A declared page's reader: a header, a list of two books and an empty notice.
 */
final readonly class ShelfLayoutResolver implements PageResolver
{
    public function read(): DeclaredLayoutData
    {
        return DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                ->asBox()
                ->key('shelf')
                ->style('stack')
                ->children(
                    LayoutPartData::build()->asText()->key('title')->value('Shelf')->style('heading')->finish(),
                    LayoutPartData::build()
                    ->asCollection()
                    ->key('books')
                    ->style('list')
                    ->rows(
                        [
                            LayoutRowData::build()->key('book-1')->label('Dune')->value('read')->finish(),
                            LayoutRowData::build()->key('book-2')->label('Emma')->value('unread')->finish(),
                        ],
                    )
                    ->finish(),
                    LayoutPartData::build()
                    ->asNotice()
                    ->key('none-lent')
                    ->style('empty')
                    ->title('No book is lent out')
                    ->finish(),
                )
                ->finish(),
            )
            ->finish();
    }
}
