<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Navigation\NavigationRecords as NavigationRecordsContract;
use App\Data\Navigation\NavigationCountsData;
use App\Data\Navigation\NavigationData;
use App\Data\Navigation\NavigationGroupData;
use App\Data\Navigation\NavigationItemData;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Http\Request;
use Psr\Log\LoggerInterface;
use Spatie\LaravelData\Optional;
use Throwable;

/**
 * The navigation for the actor of this request, read from one index built again for each call: the tree, the current
 * item and the counts all come from the same gated, merged and pruned items, so a revoked grant leaves all three.
 */
final readonly class WebNavigationRecords implements NavigationRecordsContract
{
    public function __construct(
        private NavigationMerge $merge,
        private UiDeclarations $declarations,
        private Container $container,
        private UrlGenerator $urls,
        private LoggerInterface $log,
    ) {}

    public function tree(Request $request): NavigationData
    {
        $index = $this->merge->index();

        return NavigationData::from([
            'items' => array_map(fn (NavigationCandidate $root) => $this->itemData($root), $index->roots),
            'groups' => array_map(
                fn (string $key) => NavigationGroupData::from([
                    'key' => $key,
                    'label' => $this->declarations->sidebarGroup($key)->label,
                ]),
                $index->groupKeys(),
            ),
            'current' => $this->current($request, $index),
        ]);
    }

    /**
     * Every visible counted item's count, by key, also of an item a reader lists; a count that fails is logged and
     * left out.
     */
    public function counts(): NavigationCountsData
    {
        $counts = [];

        foreach ($this->merge->index()->counted() as $candidate) {
            $key = $candidate->key();

            try {
                $counts[$key] = $this->container
                    ->make((string) $candidate->navigation->navigationItem->count)
                    ->count();
            } catch (Throwable $failure) {
                $this->log->error(
                    "The count of {$key} failed: {$failure->getMessage()}",
                    ['key' => $key, 'exception' => $failure],
                );
            }
        }

        return NavigationCountsData::from(['counts' => $counts]);
    }

    private function itemData(NavigationCandidate $candidate): NavigationItemData
    {
        $navigation = $candidate->navigation;
        $children = array_map(fn (NavigationCandidate $child) => $this->itemData($child), $candidate->children);
        $firstChildUrl = $children === [] || $children[0]->url instanceof Optional ? null : $children[0]->url;

        // A value the item does not have is left out, so its key is absent in the browser.
        return NavigationItemData::from(array_filter([
            'key' => $navigation->key,
            'label' => $navigation->navigationItem->label,
            'children' => $children,
            'isAtBottom' => $navigation->navigationItem->isAtBottom,
            'isCounted' => $navigation->navigationItem->count !== null,
            'isInSidebar' => $navigation->navigationItem->isInSidebar,
            'icon' => $navigation->navigationItem->icon,
            'url' => $navigation->page === null ? $firstChildUrl : $this->urlOf($candidate),
            'group' => $navigation->navigationItem->group,
        ], fn (mixed $optionalField) => $optionalField !== null));
    }

    private function urlOf(NavigationCandidate $candidate): string
    {
        $navigation = $candidate->navigation;
        $url = $this->urls->route($navigation->page->routeName(), $navigation->navigationItem->routeValues, false);
        $query = $navigation->navigationItem->queryValues;

        if ($query === []) {
            return $url;
        }

        return $url.'?'.http_build_query($query);
    }

    /**
     * The keys from the root down to the item that matches this request best: the most route and query values
     * matched, then the deepest, then the lowest key.
     *
     * @return list<string>
     */
    private function current(Request $request, NavigationIndex $index): array
    {
        $best = [];
        $bestRank = null;

        foreach ($index->entries() as $candidate) {
            $score = $this->matchScore($candidate, $request);

            if ($score < 0) {
                continue;
            }

            $rank = [$score, $candidate->depth(), $candidate->key()];

            if ($bestRank === null || $this->outranks($rank, $bestRank)) {
                [$best, $bestRank] = [$candidate->path, $rank];
            }
        }

        return $best;
    }

    /**
     * Whether a match ranks above the best so far: more values matched, then deeper, then a lower key.
     *
     * @param  array{int, int, string}  $rank
     * @param  array{int, int, string}  $bestRank
     */
    private function outranks(array $rank, array $bestRank): bool
    {
        return ([$rank[0], $rank[1], $bestRank[2]] <=> [$bestRank[0], $bestRank[1], $rank[2]]) > 0;
    }

    /**
     * How well an item matches the request: below zero when its page's route is not the current one or a value
     * differs, otherwise the number of route and query values it names.
     */
    private function matchScore(NavigationCandidate $candidate, Request $request): int
    {
        $navigation = $candidate->navigation;

        if ($navigation->page === null || $request->route()?->getName() !== $navigation->page->routeName()) {
            return -1;
        }

        $routeArguments = [...$navigation->navigationItem->routeValues, ...$navigation->navigationItem->queryValues];
        $actual = [...$request->query->all(), ...$request->route()->parameters()];

        foreach ($routeArguments as $name => $optionalField) {
            if ((string) ($actual[$name] ?? '') !== $optionalField) {
                return -1;
            }
        }

        return count($routeArguments);
    }
}
