<?php

declare(strict_types=1);

namespace App\Web\Support;

use App\Ui\Declarations\RegisteredNavigation;

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
        return new self($this->navigation, $this->path, $children, $this->contribution);
    }

    public function key(): string
    {
        return $this->navigation->key;
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
}
