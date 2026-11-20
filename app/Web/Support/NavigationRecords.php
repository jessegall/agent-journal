<?php

declare(strict_types=1);

namespace App\Web\Support;

use App\Ui\Contracts\CountResolver;
use App\Ui\Contracts\NavigationChildren;
use App\Ui\Declarations\RegisteredNavigation;
use App\Ui\Exceptions\UiKeyRepeated;
use App\Ui\Support\UiDeclarations;
use App\Web\Contracts\NavigationRecords as NavigationRecordsContract;
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
final readonly class NavigationRecords implements NavigationRecordsContract
{
    public function __construct(
        private UiDeclarations $declarations,
        private VisibilityChecks $visibility,
        private Container $container,
        private UrlGenerator $urls,
        private LoggerInterface $log,
        private UiOwnerAvailability $owners,
    ) {}

    public function tree(Request $request): NavigationData
    {
        $visited = [];
        $navigationLinks = [];

        foreach ($this->rootsInOrder() as $root) {
            array_push($navigationLinks, ...$this->visible($root, $visited));
        }

        return NavigationData::from(['items' => $navigationLinks, 'current' => $this->current($request, $navigationLinks)]);
    }

    /**
     * Every visible counted item's count, by key; a count that fails is logged and left out.
     */
    public function counts(): NavigationCountsData
    {
        $counts = [];

        foreach ($this->countedItems($this->declarations->navigation()) as $navigation) {
            try {
                $counts[$navigation->key] = $this->container->make((string) $navigation->item->count)->count();
            } catch (Throwable $failure) {
                $this->log->error(
                    "The count of {$navigation->key} failed: {$failure->getMessage()}",
                    ['key' => $navigation->key, 'exception' => $failure],
                );
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
    private function visible(RegisteredNavigation $navigation, array &$visited): array
    {
        if (! $this->isVisible($navigation)) {
            return [];
        }

        if (array_key_exists($navigation->key, $visited)) {
            throw UiKeyRepeated::inDomain($navigation->owner->name, 'navigation', $navigation->key);
        }

        $visited[$navigation->key] = true;
        $children = [];

        foreach ($this->childrenOf($navigation) as $child) {
            array_push($children, ...$this->visible($child, $visited));
        }

        $firstChildUrl = $children === [] || $children[0]->url instanceof Optional ? null : $children[0]->url;

        // A value the item does not have is left out, so its key is absent in the browser.
        return [NavigationItemData::from(array_filter([
            'key' => $navigation->key,
            'label' => $navigation->item->label,
            'children' => $children,
            'atFoot' => $navigation->item->atFoot,
            'counted' => $navigation->item->count !== null,
            'icon' => $navigation->item->icon,
            'url' => $navigation->page === null ? $firstChildUrl : $this->urlOf($navigation),
            'group' => $navigation->item->group,
        ], fn (mixed $optionalField) => $optionalField !== null))];
    }

    private function isVisible(RegisteredNavigation $navigation): bool
    {
        return $this->owners->isAvailable($navigation->owner)
            && ($navigation->page === null || $this->owners->isAvailable($navigation->page->owner))
            && $this->visibility->allow(array_filter([$navigation->item->visibility]))
            && ($navigation->page === null || $this->visibility->allow($navigation->page->visibilityChecks()));
    }

    /**
     * @return list<RegisteredNavigation>
     */
    private function childrenOf(RegisteredNavigation $navigation): array
    {
        if ($navigation->item->childrenResolver === null) {
            return $navigation->children;
        }

        $resolver = $this->container->make($navigation->item->childrenResolver);

        return [
            ...$navigation->children,
            ...($resolver instanceof NavigationChildren ? $this->declarations->childrenOf(
                $navigation,
                $resolver->children(),
            ) : []),
        ];
    }

    private function urlOf(RegisteredNavigation $navigation): string
    {
        $url = $this->urls->route($navigation->page->routeName(), $navigation->item->routeValues, false);

        return $navigation->item->queryValues === [] ? $url : $url.'?'.http_build_query($navigation->item->queryValues);
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
            $one->page
                ?->key !== 'web.home', $groupPositions[(string) $one->item->group], $one
                ->item
                ->position, $one
                ->key,
        ] <=> [
            $other->page
                ?->key !== 'web.home', $groupPositions[(string) $other->item->group], $other
                ->item
                ->position, $other
                ->key,
        ]);

        return $roots;
    }

    /**
     * The keys from the root down to the item that matches this request best: the most route and query values matched,
     * ties broken by key.
     *
     * @param  list<NavigationItemData>  $navigationLinks
     * @return list<string>
     */
    private function current(Request $request, array $navigationLinks): array
    {
        $best = [];
        $bestKey = '';
        $bestScore = -1;

        foreach ($this->paths($navigationLinks, []) as $key => $path) {
            $score = $this->matchScore($key, $request);

            if ($score > $bestScore || ($score === $bestScore && $score >= 0 && $key < $bestKey)) {
                [$best, $bestKey, $bestScore] = [$path, $key, $score];
            }
        }

        return $best;
    }

    /**
     * @param  list<NavigationItemData>  $navigationLinks
     * @param  list<string>  $above
     * @return array<string, list<string>> each item's path from the root, by its key
     */
    private function paths(array $navigationLinks, array $above): array
    {
        $paths = [];

        foreach ($navigationLinks as $navigation) {
            $paths[$navigation->key] = [...$above, $navigation->key];
            $paths = [...$paths, ...$this->paths($navigation->children, $paths[$navigation->key])];
        }

        return $paths;
    }

    /**
     * How well an item matches the request: below zero when its page's route is not the current one or a value
     * differs, otherwise the number of route and query values it names.
     */
    private function matchScore(string $key, Request $request): int
    {
        $navigation = $this->registeredItem($key);

        if ($navigation === null || $navigation->page === null || $request->route()?->getName() !== $navigation->page->routeName()) {
            return -1;
        }

        $routeArguments = [...$navigation->item->routeValues, ...$navigation->item->queryValues];
        $actual = [...$request->query->all(), ...$request->route()->parameters()];

        foreach ($routeArguments as $name => $optionalField) {
            if ((string) ($actual[$name] ?? '') !== $optionalField) {
                return -1;
            }
        }

        return count($routeArguments);
    }

    private function registeredItem(string $key): RegisteredNavigation|null
    {
        return $this->flatten($this->declarations->navigation())[$key] ?? null;
    }

    /**
     * The visible counted items of a tree, with their target pages visible too.
     *
     * @param  list<RegisteredNavigation>  $navigationLinks
     * @return list<RegisteredNavigation>
     */
    private function countedItems(array $navigationLinks): array
    {
        $counted = [];

        foreach ($navigationLinks as $navigation) {
            if (! $this->isVisible($navigation)) {
                continue;
            }

            if ($navigation->item->count !== null && is_subclass_of($navigation->item->count, CountResolver::class)) {
                $counted[] = $navigation;
            }

            array_push($counted, ...$this->countedItems($navigation->children));
        }

        return $counted;
    }

    /**
     * @param  list<RegisteredNavigation>  $navigationLinks
     * @return array<string, RegisteredNavigation>
     */
    private function flatten(array $navigationLinks): array
    {
        $flat = [];

        foreach ($navigationLinks as $navigation) {
            $flat[$navigation->key] = $navigation;
            $flat = [...$flat, ...$this->flatten($navigation->children)];
        }

        return $flat;
    }
}
