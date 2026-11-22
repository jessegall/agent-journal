<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\NavigationChildren;
use App\Declarations\RegisteredNavigation;
use Illuminate\Contracts\Container\Container;
use Psr\Log\LoggerInterface;

/**
 * Builds this request's navigation index: gates each item before its children are read, merges the declared children
 * with those a reader lists, drops a listed item whose key is declared, listed twice or repeats an ancestor, then
 * prunes headings left empty and orders every level, so install order never shows.
 */
final readonly class NavigationMerge
{
    public function __construct(
        private UiDeclarations $declarations,
        private VisibilityChecks $visibility,
        private Container $container,
        private LoggerInterface $log,
        private UiOwnerAvailability $owners,
    ) {}

    public function index(): NavigationIndex
    {
        $occurrences = [];
        $contributionPaths = [];
        $gathered = [];

        foreach ($this->declarations->navigation() as $root) {
            array_push($gathered, ...$this->gathered($root, [], null, $occurrences, $contributionPaths));
        }

        $dropped = $this->droppedContributions($occurrences, $contributionPaths);
        $roots = [];

        foreach ($gathered as $root) {
            array_push($roots, ...$this->pruned($root, $dropped));
        }

        return new NavigationIndex($this->rootsInOrder($roots));
    }

    /**
     * The item as the actor may see it, with every child it has this request, or nothing when a check refuses it.
     *
     * @param  list<string>  $above
     * @param  array<string, list<int|null>>  $occurrences  the contributions each key was met in, null for declared
     * @param  array<int, list<string>>  $contributionPaths
     * @return list<NavigationCandidate>
     */
    private function gathered(
        RegisteredNavigation $navigation,
        array $above,
        int|null $contribution,
        array &$occurrences,
        array &$contributionPaths,
    ): array {
        if (! $this->isVisible($navigation)) {
            return [];
        }

        $path = [...$above, $navigation->key];
        $occurrences[$navigation->key][] = $contribution;

        // A listed item repeating an ancestor's key would list itself again without end: it is dropped, unread.
        if (in_array($navigation->key, $above, true)) {
            return [new NavigationCandidate($navigation, $path, [], $contribution)];
        }

        $children = [];

        foreach ($navigation->children as $child) {
            array_push($children, ...$this->gathered($child, $path, $contribution, $occurrences, $contributionPaths));
        }

        foreach ($this->listedChildren($navigation) as $child) {
            $listed = count($contributionPaths);
            $contributionPaths[$listed] = [...$path, $child->key];
            array_push($children, ...$this->gathered($child, $path, $listed, $occurrences, $contributionPaths));
        }

        return [new NavigationCandidate($navigation, $path, $children, $contribution)];
    }

    /**
     * The contributions to drop: a declared key wins over a listed one, and two listed items with one key are both
     * dropped, so no install order chooses between them. Each is logged with its owner and path.
     *
     * @param  array<string, list<int|null>>  $occurrences
     * @param  array<int, list<string>>  $paths
     * @return array<int, true>
     */
    private function droppedContributions(array $occurrences, array $paths): array
    {
        $declaredKeys = array_fill_keys($this->declaredKeys(), true);
        $dropped = [];

        foreach ($occurrences as $key => $contributions) {
            $listed = array_filter($contributions, fn (int|null $contribution) => $contribution !== null);

            if ($listed === [] || (count($contributions) === 1 && ! array_key_exists($key, $declaredKeys))) {
                continue;
            }

            foreach ($listed as $contribution) {
                $dropped[$contribution] = true;
                $path = implode(' > ', $paths[$contribution]);

                $this->log->warning(
                    "The navigation item {$key} listed at {$path} was dropped: its key is declared or listed twice.",
                    ['key' => $key, 'path' => $paths[$contribution]],
                );
            }
        }

        return $dropped;
    }

    /**
     * The item without its dropped contributions, its children ordered by position then key; nothing when it is
     * dropped, or when it opens no page and no child is left.
     *
     * @param  array<int, true>  $dropped
     * @return list<NavigationCandidate>
     */
    private function pruned(NavigationCandidate $candidate, array $dropped): array
    {
        if ($candidate->contribution !== null && array_key_exists($candidate->contribution, $dropped)) {
            return [];
        }

        $children = [];

        foreach ($candidate->children as $child) {
            array_push($children, ...$this->pruned($child, $dropped));
        }

        if ($candidate->navigation->page === null && $children === []) {
            return [];
        }

        usort($children, fn (NavigationCandidate $one, NavigationCandidate $other) => [
            $one->navigation->navigationItem->position,
            $one->key(),
        ] <=> [$other->navigation->navigationItem->position, $other->key()]);

        return [$candidate->withChildren($children)];
    }

    /**
     * Home first, then the groups by the lowest position of their visible roots, then group key, then position, then
     * key, so equal positions keep one order.
     *
     * @param  list<NavigationCandidate>  $roots
     * @return list<NavigationCandidate>
     */
    private function rootsInOrder(array $roots): array
    {
        $groupPositions = [];

        foreach ($roots as $root) {
            $group = (string) $root->navigation->navigationItem->group;

            $groupPositions[$group] = min(
                $groupPositions[$group] ?? PHP_INT_MAX,
                $root->navigation->navigationItem->position,
            );
        }

        $order = fn (NavigationCandidate $root) => [
            $root->navigation->page?->key !== 'web.home',
            $groupPositions[(string) $root->navigation->navigationItem->group],
            (string) $root->navigation->navigationItem->group,
            $root->navigation->navigationItem->position,
            $root->key(),
        ];

        usort($roots, fn (NavigationCandidate $one, NavigationCandidate $other) => $order($one) <=> $order($other));

        return $roots;
    }

    private function isVisible(RegisteredNavigation $navigation): bool
    {
        return $this->owners->isAvailable($navigation->owner)
            && ($navigation->page === null || $this->owners->isAvailable($navigation->page->owner))
            && $this->visibility->allow(array_filter([$navigation->navigationItem->visibility]))
            && ($navigation->page === null || $this->visibility->allow($navigation->page->visibilityChecks()));
    }

    /**
     * The children the item's reader lists this request, checked as its domain's; none without a reader.
     *
     * @return list<RegisteredNavigation>
     */
    private function listedChildren(RegisteredNavigation $navigation): array
    {
        if ($navigation->navigationItem->childrenResolver === null) {
            return [];
        }

        $resolver = $this->container->make($navigation->navigationItem->childrenResolver);

        if (! $resolver instanceof NavigationChildren) {
            return [];
        }

        return $this->declarations->childrenOf($navigation, $resolver->children());
    }

    /**
     * Every declared key, also of an item hidden from this actor, so a listed item never takes a declared key.
     *
     * @return list<string>
     */
    private function declaredKeys(): array
    {
        return array_merge(
            [],
            ...array_map(fn (RegisteredNavigation $root) => $root->keys(), $this->declarations->navigation()),
        );
    }
}
