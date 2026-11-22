<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Declarations\SidebarGroup;

/**
 * A domain that owns sidebar groups, which root navigation items of any domain may join by the group's full key.
 */
interface SidebarGroupProvider
{
    /**
     * @return list<SidebarGroup>
     */
    public function sidebarGroups(): array;
}
