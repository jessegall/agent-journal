<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Navigation\RecordMenus as RecordMenusContract;
use App\Declarations\RegisteredAction;
use App\Declarations\RegisteredMenu;
use App\Declarations\RegisteredMenuItem;
use App\Enums\ActionMethod;
use App\Support\Layout\LayoutMenuData;
use App\Support\Layout\LayoutMenuGroupData;
use App\Support\Layout\LayoutMenuItemData;
use Illuminate\Contracts\Routing\UrlGenerator;

/**
 * Builds a menu for the actor of this request: the items of every installed domain whose domain and target are on and
 * whose checks allow the actor, each bound to the record given, in groups ordered by their lowest position then key,
 * and items by position then full key, so install order never shows; a group left with no item is dropped.
 */
final readonly class RecordMenus implements RecordMenusContract
{
    public function __construct(
        private UiDeclarations $declarations,
        private VisibilityChecks $visibility,
        private UiOwnerAvailability $owners,
        private UrlGenerator $urls,
    ) {}

    public function onRecord(string $menuKey, string $record): LayoutMenuData
    {
        $menu = $this->declarations->menu($menuKey);

        return $this->menuOf($menu, [(string) $menu->recordParameter => $record]);
    }

    public function general(string $menuKey): LayoutMenuData
    {
        return $this->menuOf($this->declarations->menu($menuKey), []);
    }

    /**
     * @param  array<string, string>  $routeValues
     */
    private function menuOf(RegisteredMenu $menu, array $routeValues): LayoutMenuData
    {
        $grouped = [];

        foreach ($this->declarations->menuItems($menu->key) as $item) {
            if ($this->isVisible($item)) {
                $grouped[$item->menuItem->group][] = $item;
            }
        }

        $groups = [];

        foreach ($grouped as $group => $items) {
            usort($items, fn (RegisteredMenuItem $one, RegisteredMenuItem $other) => [
                $one->menuItem->position,
                $one->key,
            ] <=> [$other->menuItem->position, $other->key]);

            $groups[] = ['key' => (string) $group, 'position' => $items[0]->menuItem->position, 'items' => $items];
        }

        usort($groups, fn (array $one, array $other) => [$one['position'], $one['key']] <=> [
            $other['position'],
            $other['key'],
        ]);

        return new LayoutMenuData($menu->key, $menu->label, array_map(fn (array $group) => new LayoutMenuGroupData(
            $group['key'],
            array_map(fn (RegisteredMenuItem $item) => $this->itemData($item, $routeValues), $group['items']),
        ), $groups));
    }

    /**
     * @param  array<string, string>  $routeValues
     */
    private function itemData(RegisteredMenuItem $item, array $routeValues): LayoutMenuItemData
    {
        $target = $item->target;
        $isAction = $target instanceof RegisteredAction;
        $routeName = $isAction ? $target->routeName : $target->routeName();
        $url = $this->urls->route($routeName, $routeValues, false);
        $query = $item->menuItem->query;

        return LayoutMenuItemData::from(array_filter([
            'key' => $item->key,
            'label' => $item->menuItem->label,
            'href' => $query === [] ? $url : $url.'?'.http_build_query($query),
            'method' => $isAction ? $target->action->method : ActionMethod::Get,
            'icon' => $item->menuItem->icon,
        ], fn (mixed $optionalField) => $optionalField !== null));
    }

    private function isVisible(RegisteredMenuItem $item): bool
    {
        return $this->owners->isAvailable($item->owner)
            && $this->owners->isAvailable($item->menu->owner)
            && $this->visibility->allow($item->visibilityChecks());
    }
}
