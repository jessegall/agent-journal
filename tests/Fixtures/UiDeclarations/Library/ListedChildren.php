<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use App\Contracts\Navigation\NavigationChildren;

/**
 * Lists the items a test put in ListedNavigation.
 */
final readonly class ListedChildren implements NavigationChildren
{
    public function __construct(private ListedNavigation $listed) {}

    public function children(): array
    {
        return $this->listed->children;
    }
}
