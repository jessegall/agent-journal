<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\CountResolver;
use App\Contracts\NavigationChildren;
use App\Contracts\VisibilityCheck;
use App\Exceptions\InvalidNavigationDeclaration;

/**
 * A checked navigation item of an installed domain: its full key, the page of its own domain it opens with route
 * values that fill that page's path exactly, and its checked children.
 */
final readonly class RegisteredNavigation
{
    /**
     * @param  RegisteredPage|null  $page  null for an item that only holds children
     * @param  list<RegisteredNavigation>  $children
     */
    private function __construct(
        public DomainUi $owner,
        public NavigationItem $navigationItem,
        public string $key,
        public RegisteredPage|null $page,
        public array $children,
    ) {}

    /**
     * @param  array<string, RegisteredPage>  $pages  the pages of every installed domain by full key
     */
    public static function of(DomainUi $owner, NavigationItem $item, array $pages): self
    {
        $key = $owner->fullKey('navigation', $item->key);

        $namedClasses = [
            NavigationChildren::class => $item->childrenResolver,
            CountResolver::class => $item->count,
            VisibilityCheck::class => $item->visibility,
        ];

        foreach (array_filter($namedClasses) as $interface => $className) {
            $owner->assertImplements($key, $className, $interface);
        }

        return new self(
            owner: $owner,
            navigationItem: $item,
            key: $key,
            page: self::checkedPage($owner, $key, $item, $pages),
            children: array_map(
                fn (NavigationItem $child) => self::of($owner, $child, $pages),
                $item->children,
            ),
        );
    }

    /**
     * The full keys of this item and every child below it.
     *
     * @return list<string>
     */
    public function keys(): array
    {
        return [$this->key, ...array_merge(...array_map(fn (self $child) => $child->keys(), $this->children))];
    }

    /**
     * @param  array<string, RegisteredPage>  $pages
     */
    private static function checkedPage(
        DomainUi $owner,
        string $key,
        NavigationItem $item,
        array $pages,
    ): RegisteredPage|null {
        if ($item->page === null) {
            return null;
        }

        $pageKey = $owner->fullKey('page', $item->page);

        if (! array_key_exists($pageKey, $pages)) {
            throw InvalidNavigationDeclaration::pageMissing($key, $pageKey);
        }

        $page = $pages[$pageKey];

        if (! $page->path->isFilledBy(array_keys($item->routeValues))) {
            throw InvalidNavigationDeclaration::routeValuesMismatch($key, $pageKey, $page->path->path);
        }

        return $page;
    }
}
