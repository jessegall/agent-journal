<?php

declare(strict_types=1);

namespace App\Contracts\Navigation;

use App\Support\Layout\LayoutMenuData;

/**
 * The menus a page or a card shows, built for the actor of this request from every installed domain's items: an item
 * whose domain is off or whose checks refuse the actor is left out, and every item is bound to the record given.
 */
interface RecordMenus
{
    /**
     * The menu with the given full key opened on the record with the given route value, such as a document's number.
     */
    public function onRecord(string $menuKey, string $record): LayoutMenuData;

    /**
     * The menu with the given full key, which takes no record.
     */
    public function general(string $menuKey): LayoutMenuData;
}
