<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use App\Navigation\Contracts\NavigationChildren;
use App\Navigation\Declarations\NavigationItem;

final class ShelfItems implements NavigationChildren
{
    public function children(): array
    {
        return [NavigationItem::page('shelf-1', 'Top shelf', page: 'book', route: ['book' => '7'])];
    }
}
