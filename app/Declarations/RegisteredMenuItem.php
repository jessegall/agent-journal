<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\VisibilityCheck;
use App\Exceptions\InvalidMenuDeclaration;

/**
 * A checked menu item of an installed domain: its full key, the menu it joins, and the page or action of its own
 * domain it targets, whose route takes exactly the menu's record parameter.
 */
final readonly class RegisteredMenuItem
{
    private function __construct(
        public DomainUi $owner,
        public MenuItem $menuItem,
        public string $key,
        public RegisteredMenu $menu,
        public RegisteredPage|RegisteredAction $target,
    ) {}

    /**
     * @param  array<string, RegisteredMenu>  $menus  by full key
     * @param  array<string, RegisteredPage>  $pages  by full key
     * @param  array<string, RegisteredAction>  $actions  by route name
     */
    public static function of(DomainUi $owner, MenuItem $item, array $menus, array $pages, array $actions): self
    {
        $key = $owner->fullKey('menu item', $item->key);

        if (! array_key_exists($item->menu, $menus)) {
            throw InvalidMenuDeclaration::menuMissing($owner->name, $key, $item->menu);
        }

        if ($item->visibility !== null) {
            $owner->assertImplements($key, $item->visibility, VisibilityCheck::class);
        }

        $menu = $menus[$item->menu];
        $target = self::targetOf($owner, $key, $item, $pages, $actions);

        if (! $target->path->isFilledBy($menu->parameters())) {
            throw InvalidMenuDeclaration::contextMismatch($key, $menu->key, $target->path->path);
        }

        return new self($owner, $item, $key, $menu, $target);
    }

    /**
     * The checks an actor must pass to see the item: its own, then those of the page it opens or guards its action.
     *
     * @return list<class-string<VisibilityCheck>>
     */
    public function visibilityChecks(): array
    {
        $guard = $this->target instanceof RegisteredAction ? $this->target->guard : $this->target;

        return [...array_filter([$this->menuItem->visibility]), ...$guard->visibilityChecks()];
    }

    /**
     * @param  array<string, RegisteredPage>  $pages
     * @param  array<string, RegisteredAction>  $actions
     */
    private static function targetOf(
        DomainUi $owner,
        string $key,
        MenuItem $item,
        array $pages,
        array $actions,
    ): RegisteredPage|RegisteredAction {
        if ($item->page !== null) {
            $pageKey = $owner->fullKey('page', $item->page);

            return $pages[$pageKey] ?? throw InvalidMenuDeclaration::targetMissing($key, $pageKey);
        }

        $routeName = $owner->fullKey('action', (string) $item->action);

        return $actions[$routeName] ?? throw InvalidMenuDeclaration::targetMissing($key, $routeName);
    }
}
