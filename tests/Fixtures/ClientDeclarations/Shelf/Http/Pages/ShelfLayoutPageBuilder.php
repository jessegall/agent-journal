<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Shelf\Http\Pages;

use App\Web\Creation\Contracts\PageBuilder;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use Illuminate\Http\Request;

/**
 * A declared page's reader: a header, a list of two books and an empty notice.
 */
final readonly class ShelfLayoutPageBuilder implements PageBuilder
{
    public function build(Request $visit): ShelfLayoutPageData
    {
        return ShelfLayoutPageData::build()->shown($this->layout())->finish();
    }

    private function layout(): DeclaredLayoutData
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
