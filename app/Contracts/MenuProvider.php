<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Declarations\Menu;
use App\Declarations\MenuItem;

/**
 * A domain that owns menus other domains may join, or puts items in menus, its own or another's.
 */
interface MenuProvider
{
    /**
     * @return list<Menu>
     */
    public function menus(): array;

    /**
     * @return list<MenuItem>
     */
    public function menuItems(): array;
}
