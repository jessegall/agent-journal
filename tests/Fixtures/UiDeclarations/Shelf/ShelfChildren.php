<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Domain\Contracts\NavigationChildren;
use App\Domain\Declarations\NavigationItem;

final readonly class ShelfChildren implements NavigationChildren
{
    public function __construct(private ReaderCalls $calls) {}

    public function children(): array
    {
        $this->calls->readers[] = 'children';

        return [NavigationItem::page('secret-shelf', 'Secret shelf', page: 'shelf', route: ['shelf' => '9'])];
    }
}
