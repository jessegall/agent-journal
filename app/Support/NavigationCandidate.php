<?php

declare(strict_types=1);

namespace App\Support;

use App\Declarations\RegisteredNavigation;

/**
 * One navigation item in this request's index: its checked declaration, the keys from the root down to it, its
 * surviving children in order, and the dynamic contribution it came in with, or none for a declared item.
 */
final readonly class NavigationCandidate
{
    /**
     * @param  list<string>  $path  the keys of its ancestors from the root, then its own
     * @param  list<NavigationCandidate>  $children
     * @param  int|null  $contribution  the number of the children reader's item it belongs to, null when declared
     */
    public function __construct(
        public RegisteredNavigation $navigation,
        public array $path,
        public array $children,
        public int|null $contribution,
    ) {}

    /**
     * @param  list<NavigationCandidate>  $children
     */
    public function withChildren(array $children): self
    {
        return clone ($this, ['children' => $children]);
    }

    public function key(): string
    {
        return $this->navigation->key;
    }

    /**
     * Where it sits among its siblings.
     */
    public function position(): int
    {
        return $this->navigation->navigationItem->position;
    }

    /**
     * The group a root is shown in, empty for none.
     */
    public function group(): string
    {
        return (string) $this->navigation->navigationItem->group;
    }

    public function isHome(): bool
    {
        return $this->navigation->page?->key === 'web.home';
    }

    /**
     * This item without the children a dropped contribution brought, its children ordered by position then key; none
     * when it came with a dropped contribution itself, or opens no page and keeps no child.
     *
     * @param  array<int, true>  $dropped
     * @return list<NavigationCandidate>
     */
    public function withoutDropped(array $dropped): array
    {
        if ($this->contribution !== null && array_key_exists($this->contribution, $dropped)) {
            return [];
        }

        $children = array_merge(
            [],
            ...array_map(fn (self $child) => $child->withoutDropped($dropped), $this->children),
        );

        if ($this->navigation->page === null && $children === []) {
            return [];
        }

        usort($children, fn (self $one, self $other) => [
            $one->position(),
            $one->key(),
        ] <=> [
            $other->position(),
            $other->key(),
        ]);

        return [$this->withChildren($children)];
    }

    /**
     * How far below a root it sits: 0 for a root.
     */
    public function depth(): int
    {
        return count($this->path) - 1;
    }

    /**
     * This item, then every item below it, in display order.
     *
     * @return list<NavigationCandidate>
     */
    public function withDescendants(): array
    {
        return [
            $this,
            ...array_merge([], ...array_map(fn (self $child) => $child->withDescendants(), $this->children)),
        ];
    }

    /**
     * Whether the navigation item shows a count.
     */
    public function isCounted(): bool
    {
        return $this->navigation->navigationItem->count !== null;
    }

    /**
     * The group the navigation item is listed under.
     */
    public function group(): string|null
    {
        return $this->navigation->navigationItem->group;
    }
}
