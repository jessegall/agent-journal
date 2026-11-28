<?php

declare(strict_types=1);

namespace App\Support;

use App\Access\Contracts\VisibilityCheck;
use App\Declarations\Page;
use App\Declarations\RegisteredAction;
use App\Declarations\RegisteredLoader;
use App\Declarations\RegisteredMenu;
use App\Declarations\RegisteredMenuItem;
use App\Declarations\RegisteredNavigation;
use App\Declarations\RegisteredSidebarGroup;
use App\Exceptions\ClientDeclarationMissing;
use App\Exceptions\ClientKeyRepeated;
use App\Exceptions\ClientPathRepeated;
use App\Exceptions\ClientRouteConflict;
use App\Exceptions\ClientSlotMissing;
use App\Navigation\Contracts\DeclaredPages;
use App\Navigation\Contracts\SlotSections;
use App\Navigation\Data\Pages\SlotSectionData;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Declarations\Loader;
use App\Navigation\Declarations\Menu;
use App\Navigation\Declarations\MenuItem;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Declarations\SidebarGroup;
use App\Navigation\Exceptions\InvalidNavigationDeclaration;
use App\Web\Creation\SurfaceAttributeMap;
use App\Web\Declarations\RegisteredPage;
use App\Web\Declarations\RegisteredSection;
use PhpOption\Option;

/**
 * The pages, sections, actions, loaders and navigation of every installed domain, checked together once at start-up
 * and never changed after. It holds class names and paths only; readers and checks are built per request by whoever
 * uses them.
 */
final readonly class ClientDeclarations implements DeclaredPages, SlotSections
{
    /**
     * @param  array<string, RegisteredPage>  $pages  by full key
     * @param  array<string, RegisteredSection>  $sections  by full key
     * @param  array<string, RegisteredAction>  $actions  by route name
     * @param  list<RegisteredNavigation>  $navigation  the root items
     * @param  list<DomainClient>  $owners  every domain, also one that declares nothing
     * @param  array<string, RegisteredSidebarGroup>  $sidebarGroups  by full key
     * @param  array<string, RegisteredMenu>  $menus  by full key
     * @param  array<string, list<RegisteredMenuItem>>  $menuItems  the items of each menu, by the menu's full key
     * @param  array<string, RegisteredLoader>  $loaders  by full key
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
        private array $loaders,
    ) {}

    /**
     * @param  list<DomainClient>  $domains
     */
    public static function check(array $domains, SurfaceAttributeMap|null $policies = null): self
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
                $registered = RegisteredPage::of($owner, $page, $policies);
                $pages[$registered->key] = $registered;

                foreach (array_keys($registered->slots) as $slotKey) {
                    if (array_key_exists($slotKey, $slotHosts)) {
                        throw ClientKeyRepeated::inDomain($owner->name, 'slot', $slotKey);
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
                if (! self::isSlotOwnerPresent($section->slot, $domains)) {
                    continue;
                }

                if (! array_key_exists($section->slot, $slotHosts)) {
                    throw ClientSlotMissing::for($owner->fullKey('section', $section->key), $section->slot);
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

            $navigation = [
                ...$navigation,
                ...$roots,
            ];
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
            self::loadersOf($domains, $pages),
        );

        $declarations->refuseRepeatedRoutes();
        $declarations->refuseRepeatedPropNames();

        return $declarations;
    }

    /**
     * Every page and shell loader of the installed owners; whether an owner is switched on is asked per call.
     *
     * @return list<RegisteredLoader>
     */
    public function loaders(): array
    {
        return array_values($this->loaders);
    }

    /**
     * The loader with the given full key, when one is declared; for a key that comes from a request.
     *
     * @return Option<RegisteredLoader>
     */
    public function loader(string $key): Option
    {
        return Option::fromArraysValue($this->loaders, $key);
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
        return $this->menus[$key] ?? throw ClientDeclarationMissing::for($key);
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
        return $this->sidebarGroups[$key] ?? throw ClientDeclarationMissing::for($key);
    }

    public function page(string $key): RegisteredPage
    {
        return $this->pages[$key] ?? throw ClientDeclarationMissing::for($key);
    }

    /**
     * @return list<DomainClient>
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
    public function ownerOf(string $key): DomainClient
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
            if ($navigationItem->group !== null || $navigationItem->isAtBottom) {
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
     * Whether the owner a slot key starts with is among the owners in use: a section for the slot of a domain that is
     * switched off has no page to show in and is left out, while a slot an owner in use does not offer is a fault.
     *
     * @param  list<DomainClient>  $domains
     */
    private static function isSlotOwnerPresent(string $slot, array $domains): bool
    {
        $ownerKey = strstr($slot, '.', true);

        foreach ($domains as $domain) {
            if ($domain->key === $ownerKey) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param  array<string, RegisteredPage>  $pages
     * @param  array<string, RegisteredSection>  $sections
     * @return array<string, RegisteredAction>
     */
    private static function actionsOf(array $pages, array $sections): array
    {
        $actions = [];

        foreach ([
            ...array_values($pages),
            ...array_values($sections),
        ] as $guard) {
            foreach ($guard->declaredActions() as $action) {
                $registered = RegisteredAction::of($guard->owner, $action, $guard);

                if (array_key_exists($registered->routeName, $actions)) {
                    throw ClientRouteConflict::nameRepeated($registered->routeName);
                }

                $actions[$registered->routeName] = $registered;
            }
        }

        return $actions;
    }

    /**
     * Every domain's menu items, checked against the menus, pages and actions, grouped by the menu each joins.
     *
     * @param  list<DomainClient>  $domains
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
     * Every owner's loaders: each page's, guarded by that page, and the owner's own, which no page guards.
     *
     * @param  list<DomainClient>  $domains
     * @param  array<string, RegisteredPage>  $pages
     * @return array<string, RegisteredLoader>
     */
    private static function loadersOf(array $domains, array $pages): array
    {
        $loaders = [];

        foreach ($domains as $owner) {
            $pageLoaders = array_merge([], ...array_map(fn (Page $page) => $page->loaders, $owner->pages));

            self::assertUniqueKeys(
                $owner,
                'loader',
                array_map(fn (Loader $loader) => $loader->name, [...$owner->loaders, ...$pageLoaders]),
            );

            foreach ($owner->loaders as $loader) {
                $registered = RegisteredLoader::of($owner, $loader, null);
                $loaders[$registered->key] = $registered;
            }

            foreach ($owner->pages as $page) {
                foreach ($page->loaders as $loader) {
                    $registered = RegisteredLoader::of($owner, $loader, $pages[$owner->fullKey('page', $page->key)]);
                    $loaders[$registered->key] = $registered;
                }
            }
        }

        return $loaders;
    }

    /**
     * @param  list<string>  $keys
     */
    private static function assertUniqueKeys(DomainClient $owner, string $type, array $keys): void
    {
        foreach (array_count_values($keys) as $key => $count) {
            if ($count > 1) {
                throw ClientKeyRepeated::inDomain($owner->name, $type, (string) $key);
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
            $routes[] = [
                $page->key,
                'GET',
                $page->owner->key.'/'.$page->path->shape(),
            ];
        }

        foreach ($this->actions as $action) {
            if (array_key_exists($action->routeName, $this->pages)) {
                throw ClientRouteConflict::nameRepeated($action->routeName);
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
                throw ClientPathRepeated::for($seen[$route], $name, $method, rtrim($shape, '/'));
            }

            $seen[$route] = $name;
        }
    }

    /**
     * Refuses two windows, sections or loaders whose flat browser prop names come out the same once dots and dashes
     * become underscores.
     */
    private function refuseRepeatedPropNames(): void
    {
        $seen = [];

        $props = [
            ...array_map(
                fn (RegisteredPage|RegisteredSection $declaration) => [
                    $declaration->propName,
                    $declaration->key,
                ],
                [...array_values($this->pages), ...array_values($this->sections)],
            ),
            ...array_map(fn (RegisteredLoader $loader) => [
                $loader->prop,
                $loader->key,
            ], array_values($this->loaders)),
        ];

        foreach ($props as [$prop, $key]) {
            if (array_key_exists($prop, $seen)) {
                throw ClientKeyRepeated::propName($prop, $seen[$prop], $key);
            }

            $seen[$prop] = $key;
        }
    }
}
