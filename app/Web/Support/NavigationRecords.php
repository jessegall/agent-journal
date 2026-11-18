<?php

declare(strict_types=1);

namespace App\Web\Support;

use App\Ui\Contracts\CountReader;
use App\Ui\Contracts\NavigationChildren;
use App\Ui\Declarations\RegisteredNavigation;
use App\Ui\Exceptions\UiKeyRepeated;
use App\Ui\Support\UiDeclarations;
use App\Web\Data\NavigationCountsData;
use App\Web\Data\NavigationData;
use App\Web\Data\NavigationItemData;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Http\Request;
use Psr\Log\LoggerInterface;
use Spatie\LaravelData\Optional;
use Throwable;

/**
 * The navigation for the actor of this request, built from the checked declarations: an item the actor may not see is
 * left out with everything under it, before its children or its count are read; records come as children from their
 * reader once per parent; a key met twice on the way down is refused, so a reader cannot loop.
 */
final readonly class NavigationRecords
{
    public function __construct(
        private UiDeclarations $declarations,
        private VisibilityChecks $visibility,
        private Container $container,
        private UrlGenerator $urls,
        private LoggerInterface $log,
    ) {}

    public function tree(Request $request): NavigationData
    {
        $visited = [];
        $items = [];

        foreach ($this->rootsInOrder() as $root) {
            array_push($items, ...$this->visible($root, $visited));
        }

        return NavigationData::from(['items' => $items, 'current' => $this->current($request, $items)]);
    }

    /**
     * Every visible counted item's count, by key; a count that fails is logged and left out.
     */
    public function counts(): NavigationCountsData
    {
        $counts = [];

        foreach ($this->countedItems($this->declarations->navigation()) as $item) {
            try {
                $counts[$item->key] = $this->container->make((string) $item->item->count)->count();
            } catch (Throwable $failure) {
                $this->log->error("The count of {$item->key} failed: {$failure->getMessage()}", ['key' => $item->key, 'exception' => $failure]);
            }
        }

        return NavigationCountsData::from(['counts' => $counts]);
    }

    /**
     * The item as the actor sees it, or nothing when a check refuses it or its page.
     *
     * @param  array<string, true>  $visited
     * @return list<NavigationItemData>
     */
    private function visible(RegisteredNavigation $item, array &$visited): array
    {
        if (! $this->isVisible($item)) {
            return [];
        }

        if (array_key_exists($item->key, $visited)) {
            throw UiKeyRepeated::inDomain($item->owner->name, 'navigation', $item->key);
        }

        $visited[$item->key] = true;
        $children = [];

        foreach ($this->childrenOf($item) as $child) {
            array_push($children, ...$this->visible($child, $visited));
        }

        $firstChildUrl = $children === [] || $children[0]->url instanceof Optional ? null : $children[0]->url;

        // A value the item does not have is left out, so its key is absent in the browser.
        return [NavigationItemData::from(array_filter([
            'key' => $item->key,
            'label' => $item->item->label,
            'children' => $children,
            'atFoot' => $item->item->atFoot,
            'counted' => $item->item->count !== null,
            'icon' => $item->item->icon,
            'url' => $item->page === null ? $firstChildUrl : $this->urlOf($item),
            'group' => $item->item->group,
        ], fn (mixed $value) => $value !== null))];
    }

    private function isVisible(RegisteredNavigation $item): bool
    {
        return $this->visibility->allow(array_filter([$item->item->visibility])) && ($item->page === null || $this->visibility->allow($item->page->visibilityChecks()));
    }

    /**
     * @return list<RegisteredNavigation>
     */
    private function childrenOf(RegisteredNavigation $item): array
    {
        if ($item->item->childrenReader === null) {
            return $item->children;
        }

        $reader = $this->container->make($item->item->childrenReader);

        return [...$item->children, ...($reader instanceof NavigationChildren ? $this->declarations->childrenOf($item, $reader->children()) : [])];
    }

    private function urlOf(RegisteredNavigation $item): string
    {
        $url = $this->urls->route($item->page->routeName(), $item->item->routeValues, false);

        return $item->item->queryValues === [] ? $url : $url.'?'.http_build_query($item->item->queryValues);
    }

    /**
     * Home first, then the groups by their lowest position, then position, then key, so equal positions keep one order.
     *
     * @return list<RegisteredNavigation>
     */
    private function rootsInOrder(): array
    {
        $roots = $this->declarations->navigation();
        $groupPositions = [];

        foreach ($roots as $root) {
            $group = (string) $root->item->group;
            $groupPositions[$group] = min($groupPositions[$group] ?? PHP_INT_MAX, $root->item->position);
        }

        usort($roots, fn (RegisteredNavigation $one, RegisteredNavigation $other) => [
            $one->page?->key !== 'web.home', $groupPositions[(string) $one->item->group], $one->item->position, $one->key,
        ] <=> [
            $other->page?->key !== 'web.home', $groupPositions[(string) $other->item->group], $other->item->position, $other->key,
        ]);

        return $roots;
    }

    /**
     * The keys from the root down to the item that matches this request best: the most route and query values matched,
     * ties broken by key.
     *
     * @param  list<NavigationItemData>  $items
     * @return list<string>
     */
    private function current(Request $request, array $items): array
    {
        $best = [];
        $bestKey = '';
        $bestScore = -1;

        foreach ($this->paths($items, []) as $key => $path) {
            $score = $this->matchScore($key, $request);

            if ($score > $bestScore || ($score === $bestScore && $score >= 0 && $key < $bestKey)) {
                [$best, $bestKey, $bestScore] = [$path, $key, $score];
            }
        }

        return $best;
    }

    /**
     * @param  list<NavigationItemData>  $items
     * @param  list<string>  $above
     * @return array<string, list<string>> each item's path from the root, by its key
     */
    private function paths(array $items, array $above): array
    {
        $paths = [];

        foreach ($items as $item) {
            $paths[$item->key] = [...$above, $item->key];
            $paths = [...$paths, ...$this->paths($item->children, $paths[$item->key])];
        }

        return $paths;
    }

    /**
     * How well an item matches the request: below zero when its page's route is not the current one or a value
     * differs, otherwise the number of route and query values it names.
     */
    private function matchScore(string $key, Request $request): int
    {
        $item = $this->registeredItem($key);

        if ($item === null || $item->page === null || $request->route()?->getName() !== $item->page->routeName()) {
            return -1;
        }

        $values = [...$item->item->routeValues, ...$item->item->queryValues];
        $actual = [...$request->query->all(), ...$request->route()->parameters()];

        foreach ($values as $name => $value) {
            if ((string) ($actual[$name] ?? '') !== $value) {
                return -1;
            }
        }

        return count($values);
    }

    private function registeredItem(string $key): RegisteredNavigation|null
    {
        return $this->flatten($this->declarations->navigation())[$key] ?? null;
    }

    /**
     * The visible counted items of a tree, with their target pages visible too.
     *
     * @param  list<RegisteredNavigation>  $items
     * @return list<RegisteredNavigation>
     */
    private function countedItems(array $items): array
    {
        $counted = [];

        foreach ($items as $item) {
            if (! $this->isVisible($item)) {
                continue;
            }

            if ($item->item->count !== null && is_subclass_of($item->item->count, CountReader::class)) {
                $counted[] = $item;
            }

            array_push($counted, ...$this->countedItems($item->children));
        }

        return $counted;
    }

    /**
     * @param  list<RegisteredNavigation>  $items
     * @return array<string, RegisteredNavigation>
     */
    private function flatten(array $items): array
    {
        $flat = [];

        foreach ($items as $item) {
            $flat[$item->key] = $item;
            $flat = [...$flat, ...$this->flatten($item->children)];
        }

        return $flat;
    }
}
