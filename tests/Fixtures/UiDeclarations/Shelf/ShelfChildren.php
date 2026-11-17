<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Core\Ui\Contracts\NavigationChildren;
use App\Core\Ui\Declarations\NavigationItem;

final readonly class ShelfChildren implements NavigationChildren
{
    public function __construct(private ReaderCalls $calls) {}

    public function children(): array
    {
        $this->calls->readers[] = 'children';

        return [NavigationItem::page('secret-shelf', 'Secret shelf', page: 'shelf', route: ['shelf' => '9'])];
    }
}
