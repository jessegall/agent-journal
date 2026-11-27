<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The navigation of one request, gated, merged, deduplicated, pruned and ordered: the one list the tree, the current
 * item and the counts are all read from, built again for every request so a revoked grant shows at once.
 */
final readonly class NavigationIndex
{
    /**
     * @param  list<NavigationCandidate>  $roots  in display order
     */
    public function __construct(public array $roots) {}

    /**
     * Every item of the index, each root followed by the items below it.
     *
     * @return list<NavigationCandidate>
     */
    public function entries(): array
    {
        return array_merge([], ...array_map(fn (NavigationCandidate $root) => $root->withDescendants(), $this->roots));
    }

    /**
     * The items that show a count.
     *
     * @return list<NavigationCandidate>
     */
    public function counted(): array
    {
        return array_values(array_filter(
            $this->entries(),
            fn (NavigationCandidate $candidate) => $candidate->isCounted(),
        ));
    }

    /**
     * The full keys of the sidebar groups its roots join, in the order the roots show them.
     *
     * @return list<string>
     */
    public function groupKeys(): array
    {
        $groups = array_map(fn (NavigationCandidate $root) => $root->group(), $this->roots);

        return array_values(array_unique(array_filter($groups, fn (string|null $group) => $group !== null)));
    }
}
