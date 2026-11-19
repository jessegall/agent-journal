<?php

declare(strict_types=1);

namespace App\Ui\Support;

use App\Ui\Contracts\VisibilityCheck;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\RegisteredAction;
use App\Ui\Declarations\RegisteredNavigation;
use App\Ui\Declarations\RegisteredPage;
use App\Ui\Declarations\RegisteredSection;
use App\Ui\Exceptions\InvalidNavigationDeclaration;
use App\Ui\Exceptions\UiDeclarationMissing;
use App\Ui\Exceptions\UiKeyRepeated;
use App\Ui\Exceptions\UiPathRepeated;
use App\Ui\Exceptions\UiRouteConflict;
use App\Ui\Exceptions\UiSlotMissing;
use PhpOption\Option;

/**
 * The pages, sections, actions and navigation of every installed domain, checked together once at start-up and never
 * changed after. It holds class names and paths only; readers and checks are built per request by whoever uses them.
 */
final readonly class UiDeclarations
{
    /**
     * @param  array<string, RegisteredPage>  $pages  by full key
     * @param  array<string, RegisteredSection>  $sections  by full key
     * @param  array<string, RegisteredAction>  $actions  by route name
     * @param  list<RegisteredNavigation>  $navigation  the root items
     * @param  list<DomainUi>  $owners  every domain, also one that declares nothing
     */
    private function __construct(
        private array $pages,
        private array $sections,
        private array $actions,
        private array $navigation,
        private array $owners,
    ) {}

    /**
     * @param  list<DomainUi>  $domains
     */
    public static function check(array $domains): self
    {
        $pages = [];
        $slotHosts = [];

        foreach ($domains as $owner) {
            self::refuseRepeatedKeys($owner, 'page', array_map(fn ($page) => $page->key, $owner->pages));

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
            self::refuseRepeatedKeys($owner, 'section', array_map(fn ($section) => $section->key, $owner->sections));

            foreach ($owner->sections as $section) {
                if (! array_key_exists($section->slot, $slotHosts)) {
                    throw UiSlotMissing::for($owner->fullKey('section', $section->key), $section->slot);
                }

                $registered = RegisteredSection::of($owner, $section, $slotHosts[$section->slot]);
                $sections[$registered->key] = $registered;
            }

            $roots = array_map(
                fn (NavigationItem $item) => RegisteredNavigation::of($owner, $item, $pages),
                $owner->navigation,
            );
            self::refuseRepeatedKeys(
                $owner,
                'navigation',
                array_merge([], ...array_map(fn (RegisteredNavigation $root) => $root->keys(), $roots)),
            );
            $navigation = [...$navigation, ...$roots];
        }

        $declarations = new self($pages, $sections, self::actionsOf($pages, $sections), $navigation, $domains);
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
     * parent's domain, opening that domain's pages, each key once.
     *
     * @param  list<NavigationItem>  $items
     * @return list<RegisteredNavigation>
     */
    public function childrenOf(RegisteredNavigation $parent, array $items): array
    {
        foreach ($items as $item) {
            if ($item->group !== null || $item->atFoot) {
                throw InvalidNavigationDeclaration::rootOnlyOnChild($parent->key, $item->key);
            }
        }

        $children = array_map(
            fn (NavigationItem $item) => RegisteredNavigation::of($parent->owner, $item, $this->pages),
            $items,
        );
        self::refuseRepeatedKeys(
            $parent->owner,
            'navigation',
            array_merge([], ...array_map(fn (RegisteredNavigation $child) => $child->keys(), $children)),
        );

        return $children;
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
     * @param  list<string>  $keys
     */
    private static function refuseRepeatedKeys(DomainUi $owner, string $type, array $keys): void
    {
        foreach (array_count_values($keys) as $key => $count) {
            if ($count > 1) {
                throw UiKeyRepeated::inDomain($owner->name, $type, (string) $key);
            }
        }
    }

    /**
     * Refuses a page key that is also an action name, and two routes of one domain that answer the same method and URLs.
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
     * Refuses two windows or sections whose flat browser prop names come out the same once dots and dashes become underscores.
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
