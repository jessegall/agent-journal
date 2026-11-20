<?php

declare(strict_types=1);

namespace App\Ui\Declarations;

use App\Ui\Contracts\CountResolver;
use App\Ui\Contracts\NavigationChildren;
use App\Ui\Contracts\VisibilityCheck;
use App\Ui\Enums\Icon;
use App\Ui\Exceptions\InvalidNavigationDeclaration;

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
     * @param  class-string<NavigationChildren>|null  $childrenResolver  null when the item lists no records as children
     * @param  string|null  $group  the sidebar group of a root item, or null for none
     * @param  class-string<VisibilityCheck>|null  $visibility  null when everyone who sees its page sees the item
     * @param  class-string<CountResolver>|null  $count  null when the item shows no count
     */
    private function __construct(
        public readonly string $key,
        public readonly string $label,
        public readonly Icon|null $icon,
        public readonly string|null $page,
        public readonly array $routeValues = [],
        public readonly array $queryValues = [],
        public readonly array $children = [],
        public readonly string|null $childrenResolver = null,
        public readonly int $position = 0,
        public readonly string|null $group = null,
        public readonly bool $atFoot = false,
        public readonly string|null $visibility = null,
        public readonly string|null $count = null,
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
        self::assertNoLooseValues($key, 'route', $route);
        self::assertNoLooseValues($key, 'query', $query);

        return new self($key, $label, $icon, $page ?? $key, $route, $query, position: $position, group: $group);
    }

    /**
     * An item that opens no page and holds child items, given as values, read per request, or both.
     *
     * @param  list<NavigationItem>  $children
     * @param  class-string<NavigationChildren>|null  $childrenResolver
     */
    public static function heading(
        string $key,
        string $label,
        Icon|null $icon = null,
        array $children = [],
        string|null $childrenResolver = null,
        string|null $group = null,
        int $position = 0,
    ): self {
        if ($children === [] && $childrenResolver === null) {
            throw InvalidNavigationDeclaration::nothingToOpen($key);
        }

        return new self(
            $key,
            $label,
            $icon,
            null,
            position: $position,
            group: $group,
        )->withChildren($children, $childrenResolver);
    }

    /**
     * @param  list<NavigationItem>  $children
     */
    public function children(array $children): self
    {
        return $this->withChildren($children, $this->childrenResolver);
    }

    /**
     * @param  class-string<NavigationChildren>  $resolver
     */
    public function childrenFrom(string $resolver): self
    {
        return $this->withChildren($this->children, $resolver);
    }

    /**
     * @param  class-string<CountResolver>  $resolver
     */
    public function count(string $resolver): self
    {
        return clone ($this, ['count' => $resolver]);
    }

    /**
     * @param  class-string<VisibilityCheck>  $check
     */
    public function visibleWhen(string $check): self
    {
        return clone ($this, ['visibility' => $check]);
    }

    public function atFoot(): self
    {
        return clone ($this, ['atFoot' => true]);
    }

    /**
     * @param  list<NavigationItem>  $children
     * @param  class-string<NavigationChildren>|null  $resolver
     */
    private function withChildren(array $children, string|null $resolver): self
    {
        foreach ($children as $child) {
            if ($child->group !== null || $child->atFoot) {
                throw InvalidNavigationDeclaration::rootOnlyOnChild($this->key, $child->key);
            }
        }

        return clone ($this, ['children' => $children, 'childrenResolver' => $resolver]);
    }

    /**
     * @param  array<mixed>  $values
     */
    private static function assertNoLooseValues(string $item, string $type, array $values): void
    {
        if (! array_all($values, fn (mixed $value, int|string $name) => is_string($name) && is_string($value))) {
            throw InvalidNavigationDeclaration::valuesNotStrings($item, $type);
        }
    }
}
