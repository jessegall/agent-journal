<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\Authorization\VisibilityCheck;
use App\Contracts\Navigation\PageResolver;
use App\Exceptions\UiSlotMismatch;

/**
 * A checked page of an installed domain: its full key, which is also its route name, its URI under the domain's
 * prefix, its reader, its component file and its window prop name on Home.
 */
final readonly class RegisteredPage
{
    /**
     * Web's Home, served at / under the route name home.
     */
    public const string HOME = 'web.home';

    /**
     * @param  array<string, Slot>  $slots  the page's slots by full key
     */
    private function __construct(
        public DomainUi $owner,
        public Page $page,
        public string $key,
        public RoutePath $path,
        public string $uri,
        public ResolverDefinition $resolver,
        public string $componentFile,
        public string $propName,
        public array $slots,
    ) {}

    public static function of(DomainUi $owner, Page $page): self
    {
        $key = $owner->fullKey('page', $page->key);
        $path = RoutePath::of($key, $page->path);

        if ($page->visibility !== null) {
            $owner->assertImplements($key, $page->visibility, VisibilityCheck::class);
        }

        return new self(
            owner: $owner,
            page: $page,
            key: $key,
            path: $path,
            uri: $owner->uri($path),
            resolver: ResolverDefinition::of($owner, $key, $page->resolver, PageResolver::class, $page->dataClass),
            componentFile: $owner->presentationFile($key, $page->component, $page->isDeclared),
            propName: 'window_'.str_replace([
                '.',
                '-',
            ], '_', $key),
            slots: self::checkedSlots($owner, $key, $path, $page->slots),
        );
    }

    /**
     * @return list<ActionRoute>
     */
    public function declaredActions(): array
    {
        return $this->page->actions;
    }

    /**
     * The checks an actor must pass to see this page, in the order they run.
     *
     * @return list<class-string<VisibilityCheck>>
     */
    public function visibilityChecks(): array
    {
        if ($this->page->visibility === null) {
            return [];
        }

        return [$this->page->visibility];
    }

    /**
     * @param  list<Slot>  $slots
     * @return array<string, Slot>
     */
    private static function checkedSlots(DomainUi $owner, string $page, RoutePath $path, array $slots): array
    {
        $checked = [];

        foreach ($slots as $slot) {
            $slotKey = $owner->fullKey('slot', $slot->key);

            if ($slot->recordParameter !== null && ! $path->hasParameter($slot->recordParameter)) {
                throw UiSlotMismatch::parameterMissing($page, $slotKey, $slot->recordParameter);
            }

            $checked[$slotKey] = $slot;
        }

        return $checked;
    }

    /**
     * The name the browser loads its component by: the domain's key and the component's path without .vue, so two
     * domains' Index.vue never share one.
     */
    public function componentName(): string
    {
        return $this->owner->presentationName($this->page->component, $this->page->isDeclared);
    }

    public function isHome(): bool
    {
        return $this->key === self::HOME;
    }

    /**
     * The route name the page is served under: Home's is home, every other page's its full key.
     */
    public function routeName(): string
    {
        if ($this->isHome()) {
            return 'home';
        }

        return $this->key;
    }

    /**
     * The address the page is served at: Home at /, every other page under its domain's prefix.
     */
    public function address(): string
    {
        if ($this->isHome()) {
            return '/';
        }

        return $this->uri;
    }
}
