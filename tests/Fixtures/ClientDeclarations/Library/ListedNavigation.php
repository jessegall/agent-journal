<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use App\Navigation\Declarations\NavigationItem;

/**
 * What ListedChildren lists and whether RevocableSight still lets the actor see, set by a test between reads.
 */
final class ListedNavigation
{
    /**
     * @var list<NavigationItem>
     */
    public array $children = [];

    public bool $isRevoked = false;
}
