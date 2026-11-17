<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use App\Core\Ui\Contracts\NavigationChildren;
use App\Core\Ui\Declarations\NavigationItem;

final class ShelfItems implements NavigationChildren
{
    public function children(): array
    {
        return [NavigationItem::page('shelf-1', 'Top shelf', page: 'book', route: ['book' => '7'])];
    }
}
