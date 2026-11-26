<?php

declare(strict_types=1);

namespace App\Support;

use App\Declarations\RegisteredAction;
use App\Declarations\RegisteredMenu;
use App\Declarations\RegisteredMenuItem;
use App\Navigation\Contracts\RecordMenus as RecordMenusContract;
use App\Navigation\Layout\LayoutMenuData;
use App\Navigation\Layout\LayoutMenuGroupData;
use App\Navigation\Layout\LayoutMenuItemData;
use App\Settings\Enums\ActionMethod;
use Illuminate\Contracts\Routing\UrlGenerator;

/**
 * Builds a menu for the actor of this request: the items of every installed domain whose domain and target are on and
 * whose checks allow the actor, each bound to the record given, in groups ordered by their lowest position then key,
 * and items by position then full key, so install order never shows; a group left with no item is dropped.
 */
final readonly class RecordMenus implements RecordMenusContract
{
    public function __construct(
        private ClientDeclarations $declarations,
        private VisibilityChecks $visibility,
        private ClientOwnerAvailability $owners,
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

        $grouped = array_map(fn (array $items) => self::inOrder($items), $grouped);
        $itemsByGroup = $grouped;

        uksort($grouped, fn (int|string $one, int|string $other) => [
            $itemsByGroup[$one][0]->menuItem->position,
            (string) $one,
        ] <=> [
            $itemsByGroup[$other][0]->menuItem->position,
            (string) $other,
        ]);

        return LayoutMenuData::from([
            'key' => $menu->key,
            'label' => $menu->label,
            'groups' => array_map(fn (int|string $group) => LayoutMenuGroupData::from([
                'key' => (string) $group,
                'items' => array_map(
                    fn (RegisteredMenuItem $item) => $this->itemData($item, $routeValues),
                    $grouped[$group],
                ),
            ]), array_keys($grouped)),
        ]);
    }

    /**
     * The items of one group by their position, then their key.
     *
     * @param  list<RegisteredMenuItem>  $items
     * @return list<RegisteredMenuItem>
     */
    private static function inOrder(array $items): array
    {
        usort($items, fn (RegisteredMenuItem $one, RegisteredMenuItem $other) => [
            $one->menuItem->position,
            $one->key,
        ] <=> [
            $other->menuItem->position,
            $other->key,
        ]);

        return $items;
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
