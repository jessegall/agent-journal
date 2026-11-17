<?php

declare(strict_types=1);

namespace App\Domain\Declarations;

use App\Domain\Contracts\CountReader;
use App\Domain\Contracts\NavigationChildren;
use App\Domain\Contracts\VisibilityCheck;
use App\Domain\Enums\Icon;
use App\Domain\Exceptions\InvalidNavigationDeclaration;

/**
 * An item in the sidebar, keyed within its domain: it opens a page of the same domain with route and query values,
 * holds child items, or both. Children are values, so a cycle cannot be written. Each change returns a new item.
 */
final class NavigationItem
{
    /**
     * @param  string|null  $page  the key of a page of the same domain, or null for an item that only holds children
     * @param  array<string, string>  $routeValues
     * @param  array<string, string>  $queryValues
     * @param  list<NavigationItem>  $children
     * @param  class-string<NavigationChildren>|null  $childrenReader  null when the item lists no records as children
     * @param  string|null  $group  the sidebar group of a root item, or null for none
     * @param  class-string<VisibilityCheck>|null  $visibility  null when everyone who sees its page sees the item
     * @param  class-string<CountReader>|null  $count  null when the item shows no count
     */
    private function __construct(
        public private(set) string $key,
        public private(set) string $label,
        public private(set) Icon|null $icon,
        public private(set) string|null $page,
        public private(set) array $routeValues = [],
        public private(set) array $queryValues = [],
        public private(set) array $children = [],
        public private(set) string|null $childrenReader = null,
        public private(set) int $position = 0,
        public private(set) string|null $group = null,
        public private(set) bool $atFoot = false,
        public private(set) string|null $visibility = null,
        public private(set) string|null $count = null,
    ) {}

    /**
     * An item that opens a page of its domain: the page of its own key, unless another is named.
     *
     * @param  array<string, string>  $route  the values of the page's route parameters
     * @param  array<string, string>  $query
     */
    public static function page(
        string $key,
        string $label,
        Icon|null $icon = null,
        string|null $page = null,
        array $route = [],
        array $query = [],
        string|null $group = null,
        int $position = 0,
    ): self {
        self::refuseLooseValues($key, 'route', $route);
        self::refuseLooseValues($key, 'query', $query);

        return new self($key, $label, $icon, $page ?? $key, $route, $query, position: $position, group: $group);
    }

    /**
     * An item that opens no page and holds child items, given as values, read per request, or both.
     *
     * @param  list<NavigationItem>  $children
     * @param  class-string<NavigationChildren>|null  $childrenReader
     */
    public static function heading(
        string $key,
        string $label,
        Icon|null $icon = null,
        array $children = [],
        string|null $childrenReader = null,
        string|null $group = null,
        int $position = 0,
    ): self {
        if ($children === [] && $childrenReader === null) {
            throw InvalidNavigationDeclaration::nothingToOpen($key);
        }

        return new self($key, $label, $icon, null, position: $position, group: $group)->withChildren($children, $childrenReader);
    }

    /**
     * @param  list<NavigationItem>  $children
     */
    public function children(array $children): self
    {
        return $this->withChildren($children, $this->childrenReader);
    }

    /**
     * @param  class-string<NavigationChildren>  $reader
     */
    public function childrenFrom(string $reader): self
    {
        return $this->withChildren($this->children, $reader);
    }

    /**
     * @param  class-string<CountReader>  $reader
     */
    public function count(string $reader): self
    {
        $item = clone $this;
        $item->count = $reader;

        return $item;
    }

    /**
     * @param  class-string<VisibilityCheck>  $check
     */
    public function visibleWhen(string $check): self
    {
        $item = clone $this;
        $item->visibility = $check;

        return $item;
    }

    public function atFoot(): self
    {
        $item = clone $this;
        $item->atFoot = true;

        return $item;
    }

    /**
     * @param  list<NavigationItem>  $children
     * @param  class-string<NavigationChildren>|null  $reader
     */
    private function withChildren(array $children, string|null $reader): self
    {
        foreach ($children as $child) {
            if ($child->group !== null || $child->atFoot) {
                throw InvalidNavigationDeclaration::rootOnlyOnChild($this->key, $child->key);
            }
        }

        $item = clone $this;
        $item->children = array_values($children);
        $item->childrenReader = $reader;

        return $item;
    }

    /**
     * @param  array<mixed>  $values
     */
    private static function refuseLooseValues(string $item, string $kind, array $values): void
    {
        if (! array_all($values, fn (mixed $value, int|string $name) => is_string($name) && is_string($value))) {
            throw InvalidNavigationDeclaration::valuesNotStrings($item, $kind);
        }
    }
}
