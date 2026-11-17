<?php

declare(strict_types=1);

namespace App\Core\Ui\Contracts;

use App\Core\Ui\Declarations\NavigationItem;

/**
 * Lists records as the child items of a navigation item; built per request by the container.
 */
interface NavigationChildren
{
    /**
     * @return list<NavigationItem>
     */
    public function children(): array;
}
