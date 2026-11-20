<?php

declare(strict_types=1);

namespace App\Ui\Contracts;

use App\Ui\Declarations\NavigationItem;

/**
 * A domain that puts items in the sidebar, each opening one of its own pages or holding child items.
 */
interface NavigationProvider
{
    /**
     * @return list<NavigationItem>
     */
    public function navigation(): array;
}
