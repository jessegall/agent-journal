<?php

declare(strict_types=1);

namespace App\Core\Ui\Contracts;

use App\Core\Ui\Declarations\NavigationItem;

/**
 * A domain that puts items in the sidebar, each opening one of its own pages or holding child items.
 */
interface ProvidesNavigation
{
    /**
     * @return list<NavigationItem>
     */
    public function navigation(): array;
}
