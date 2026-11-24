<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\VisibilityCheck;
use App\Contracts\Navigation\DeclaredPages;
use App\Contracts\Navigation\SlotSections;
use App\Data\Pages\SlotSectionData;
use App\Declarations\DomainUi;
use App\Declarations\Menu;
use App\Declarations\MenuItem;
use App\Declarations\NavigationItem;
use App\Declarations\RegisteredAction;
use App\Declarations\RegisteredMenu;
use App\Declarations\RegisteredMenuItem;
use App\Declarations\RegisteredNavigation;
use App\Declarations\RegisteredPage;
use App\Declarations\RegisteredSection;
use App\Declarations\RegisteredSidebarGroup;
use App\Declarations\SidebarGroup;
use App\Exceptions\InvalidNavigationDeclaration;
use App\Exceptions\UiDeclarationMissing;
use App\Exceptions\UiKeyRepeated;
use App\Exceptions\UiPathRepeated;
use App\Exceptions\UiRouteConflict;
use App\Exceptions\UiSlotMissing;
use PhpOption\Option;

/**
 * The pages, sections, actions and navigation of every installed domain, checked together once at start-up and never
 * changed after. It holds class names and paths only; readers and checks are built per request by whoever uses them.
 */
final readonly class UiDeclarations implements DeclaredPages, SlotSections
{
    /**
     * @param  array<string, RegisteredPage>  $pages  by full key
     * @param  array<string, RegisteredSection>  $sections  by full key
     * @param  array<string, RegisteredAction>  $actions  by route name
     * @param  list<RegisteredNavigation>  $navigation  the root items
     * @param  list<DomainUi>  $owners  every domain, also one that declares nothing
     * @param  array<string, RegisteredSidebarGroup>  $sidebarGroups  by full key
     * @param  array<string, RegisteredMenu>  $menus  by full key
     * @param  array<string, list<RegisteredMenuItem>>  $menuItems  the items of each menu, by the menu's full key
     */
    private function __construct(
        private array $pages,
        private array $sections,
        private array $actions,
        private array $navigation,
        private array $owners,
        private array $sidebarGroups,
        private array $menus,
        private array $menuItems,
    ) {}

    /**
     * @param  list<DomainUi>  $domains
     */
    public static function check(array $domains): self
    {
        $pages = [];
        $slotHosts = [];
        $sidebarGroups = [];
        $menus = [];

        foreach ($domains as $owner) {
            self::assertUniqueKeys($owner, 'page', array_map(fn ($page) => $page->key, $owner->pages));

            self::assertUniqueKeys(
                $owner,
                'sidebar group',
                array_map(fn (SidebarGroup $group) => $group->key, $owner->sidebarGroups),
            );

            foreach ($owner->sidebarGroups as $group) {
                $registeredGroup = RegisteredSidebarGroup::of($owner, $group);
                $sidebarGroups[$registeredGroup->key] = $registeredGroup;
            }

            self::assertUniqueKeys($owner, 'menu', array_map(fn (Menu $menu) => $menu->key, $owner->menus));

            foreach ($owner->menus as $menu) {
                $registeredMenu = RegisteredMenu::of($owner, $menu);
                $menus[$registeredMenu->key] = $registeredMenu;
            }

            foreach ($owner->pages as $page) {
                $registered = RegisteredPage::of($owner, $page);
                $pages[$registered->key] = $registered;

                foreach (array_keys($registered->slots) as $slotKey) {
                    if (array_key_exists($slotKey, $slotHosts)) {
                        throw UiKeyRepeated::inDomain($owner->name, 'slot', $slotKey);
                    }

                    $slotHosts[$slotKey] = $registered;
                }
            }
        }

        $sections = [];
        $navigation = [];

        foreach ($domains as $owner) {
            self::assertUniqueKeys($owner, 'section', array_map(fn ($section) => $section->key, $owner->sections));

            foreach ($owner->sections as $section) {
                if (! array_key_exists($section->slot, $slotHosts)) {
                    throw UiSlotMissing::for($owner->fullKey('section', $section->key), $section->slot);
                }

                $registered = RegisteredSection::of($owner, $section, $slotHosts[$section->slot]);
                $sections[$registered->key] = $registered;
            }

            $roots = array_map(
                fn (NavigationItem $navigationItem) => RegisteredNavigation::of($owner, $navigationItem, $pages),
                $owner->navigation,
            );

            self::assertUniqueKeys(
                $owner,
                'navigation',
                array_merge([], ...array_map(fn (RegisteredNavigation $root) => $root->keys(), $roots)),
            );

            foreach ($roots as $root) {
                $group = $root->navigationItem->group;

                if ($group !== null && ! array_key_exists($group, $sidebarGroups)) {
                    throw InvalidNavigationDeclaration::groupMissing($root->key, $group);
                }
            }

            $navigation = [...$navigation, ...$roots];
        }

        $actions = self::actionsOf($pages, $sections);

        $declarations = new self(
            $pages,
            $sections,
            $actions,
            $navigation,
            $domains,
            $sidebarGroups,
            $menus,
            self::menuItemsOf($domains, $menus, $pages, $actions),
        );

        $declarations->refuseRepeatedRoutes();
        $declarations->refuseRepeatedPropNames();

        return $declarations;
    }

    /**
     * @return list<RegisteredPage>
     */
    public function pages(): array
    {
        return array_values($this->pages);
    }

    /**
     * @return list<RegisteredSection>
     */
    public function sections(): array
    {
        return array_values($this->sections);
    }

    /**
     * Every native part a declared layout may mount, by the name a layout part gives it, with its component file.
     *
     * @return array<string, string>
     */
    public function nativeParts(): array
    {
        $parts = [];

        foreach ($this->owners as $owner) {
            foreach ($owner->nativeParts as $component) {
                $parts[$owner->presentationName($component, false)] = $owner->componentFile(
                    "{$owner->key} native part",
                    $component,
                );
            }
        }

        return $parts;
    }

    public function sectionsIn(string $page, string $slot): array
    {
        return array_values(array_map(
            fn (RegisteredSection $section) => SlotSectionData::from([
                'propName' => $section->propName,
                'component' => $section->componentName(),
            ]),
            array_filter(
                $this->sections(),
                fn (RegisteredSection $section) => $section->host->key === $page && $section->slot->key === $slot,
            ),
        ));
    }

    /**
     * @return list<RegisteredAction>
     */
    public function actions(): array
    {
        return array_values($this->actions);
    }

    /**
     * @return list<RegisteredNavigation>
     */
    public function navigation(): array
    {
        return $this->navigation;
    }

    /**
     * The menu with the given full key, as checked at start-up.
     */
    public function menu(string $key): RegisteredMenu
    {
        return $this->menus[$key] ?? throw UiDeclarationMissing::for($key);
    }

    /**
     * The items every installed domain puts in the menu with the given full key, in no particular order.
     *
     * @return list<RegisteredMenuItem>
     */
    public function menuItems(string $menuKey): array
    {
        return $this->menuItems[$menuKey] ?? [];
    }

    /**
     * The sidebar group with the given full key, which every grouped root item names, as checked at start-up.
     */
    public function sidebarGroup(string $key): RegisteredSidebarGroup
    {
        return $this->sidebarGroups[$key] ?? throw UiDeclarationMissing::for($key);
    }

    public function page(string $key): RegisteredPage
    {
        return $this->pages[$key] ?? throw UiDeclarationMissing::for($key);
    }

    /**
     * @return list<DomainUi>
     */
    public function owners(): array
    {
        return $this->owners;
    }

    /**
     * The page with the given full key, when one is declared; for a key that comes from a request.
     *
     * @return Option<RegisteredPage>
     */
    public function pageOrNone(string $key): Option
    {
        return Option::fromArraysValue($this->pages, $key);
    }

    public function declares(string $page): bool
    {
        return isset($this->pages[$page]);
    }

    public function addressOf(string $page, array $arguments): string
    {
        return route($this->page($page)->routeName(), $arguments, false);
    }

    /**
     * The domain that declares the page or section with the given full key.
     */
    public function ownerOf(string $key): DomainUi
    {
        if (array_key_exists($key, $this->sections)) {
            return $this->sections[$key]->owner;
        }

        return $this->page($key)->owner;
    }

    /**
     * The checks an actor must pass to see the page or section with the given full key, in the order they run.
     *
     * @return list<class-string<VisibilityCheck>>
     */
    public function visibilityChecksOf(string $key): array
    {
        if (array_key_exists($key, $this->sections)) {
            return $this->sections[$key]->visibilityChecks();
        }

        return $this->page($key)->visibilityChecks();
    }

    /**
     * Checks the items a children reader returned for a parent the same way as declared items: as children, under the
     * parent's domain, opening that domain's pages. A key met twice is the navigation index's to drop, per request.
     *
     * @param  list<NavigationItem>  $navigationItems
     * @return list<RegisteredNavigation>
     */
    public function childrenOf(RegisteredNavigation $parent, array $navigationItems): array
    {
        foreach ($navigationItems as $navigationItem) {
            if ($navigationItem->group !== null || $navigationItem->atBottom) {
                throw InvalidNavigationDeclaration::rootOnlyOnChild($parent->key, $navigationItem->key);
            }
        }

        return array_map(
            fn (NavigationItem $navigationItem) => RegisteredNavigation::of(
                $parent->owner,
                $navigationItem,
                $this->pages,
            ),
            $navigationItems,
        );
    }

    /**
     * @param  array<string, RegisteredPage>  $pages
     * @param  array<string, RegisteredSection>  $sections
     * @return array<string, RegisteredAction>
     */
    private static function actionsOf(array $pages, array $sections): array
    {
        $actions = [];

        foreach ([...array_values($pages), ...array_values($sections)] as $guard) {
            foreach ($guard->declaredActions() as $action) {
                $registered = RegisteredAction::of($guard->owner, $action, $guard);

                if (array_key_exists($registered->routeName, $actions)) {
                    throw UiRouteConflict::nameRepeated($registered->routeName);
                }

                $actions[$registered->routeName] = $registered;
            }
        }

        return $actions;
    }

    /**
     * Every domain's menu items, checked against the menus, pages and actions, grouped by the menu each joins.
     *
     * @param  list<DomainUi>  $domains
     * @param  array<string, RegisteredMenu>  $menus
     * @param  array<string, RegisteredPage>  $pages
     * @param  array<string, RegisteredAction>  $actions
     * @return array<string, list<RegisteredMenuItem>>
     */
    private static function menuItemsOf(array $domains, array $menus, array $pages, array $actions): array
    {
        $items = [];

        foreach ($domains as $owner) {
            self::assertUniqueKeys(
                $owner,
                'menu item',
                array_map(fn (MenuItem $item) => $item->key, $owner->menuItems),
            );

            foreach ($owner->menuItems as $item) {
                $registered = RegisteredMenuItem::of($owner, $item, $menus, $pages, $actions);
                $items[$registered->menu->key][] = $registered;
            }
        }

        return $items;
    }

    /**
     * @param  list<string>  $keys
     */
    private static function assertUniqueKeys(DomainUi $owner, string $type, array $keys): void
    {
        foreach (array_count_values($keys) as $key => $count) {
            if ($count > 1) {
                throw UiKeyRepeated::inDomain($owner->name, $type, (string) $key);
            }
        }
    }

    /**
     * Refuses a page key that is also an action name, and two routes of one domain that answer the same method and
     * URLs.
     */
    private function refuseRepeatedRoutes(): void
    {
        $routes = [];

        foreach ($this->pages as $page) {
            $routes[] = [$page->key, 'GET', $page->owner->key.'/'.$page->path->shape()];
        }

        foreach ($this->actions as $action) {
            if (array_key_exists($action->routeName, $this->pages)) {
                throw UiRouteConflict::nameRepeated($action->routeName);
            }

            $routes[] = [
                $action->routeName,
                $action->action->method->value,
                $action->owner->key.'/'.$action->path->shape(),
            ];
        }

        $seen = [];

        foreach ($routes as [$name, $method, $shape]) {
            $route = "{$method} ".rtrim($shape, '/');

            if (array_key_exists($route, $seen)) {
                throw UiPathRepeated::for($seen[$route], $name, $method, rtrim($shape, '/'));
            }

            $seen[$route] = $name;
        }
    }

    /**
     * Refuses two windows or sections whose flat browser prop names come out the same once dots and dashes become
     * underscores.
     */
    private function refuseRepeatedPropNames(): void
    {
        $seen = [];

        foreach ([...array_values($this->pages), ...array_values($this->sections)] as $declaration) {
            if (array_key_exists($declaration->propName, $seen)) {
                throw UiKeyRepeated::propName($declaration->propName, $seen[$declaration->propName], $declaration->key);
            }

            $seen[$declaration->propName] = $declaration->key;
        }
    }
}
