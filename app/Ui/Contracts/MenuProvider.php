<?php

declare(strict_types=1);

namespace App\Ui\Contracts;

use App\Ui\Declarations\Menu;
use App\Ui\Declarations\MenuItem;

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
