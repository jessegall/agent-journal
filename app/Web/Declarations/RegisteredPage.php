<?php

declare(strict_types=1);

namespace App\Web\Declarations;

use App\Access\Contracts\VisibilityCheck;
use App\Declarations\ActionRoute;
use App\Declarations\Page;
use App\Declarations\RoutePath;
use App\Navigation\Declarations\DomainClient;
use App\Web\Creation\SurfaceAttributeMap;
use App\Web\Creation\SurfaceDefinition;
use App\Web\Exceptions\ClientSlotMismatch;
use App\Web\Exceptions\InvalidPageDeclaration;

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
     * @param  list<class-string<VisibilityCheck>> $checks
     * @param  array<string, Slot>  $slots  the page's slots by full key
     */
    private function __construct(
        public DomainClient $owner,
        public Page $page,
        public string $key,
        public RoutePath $path,
        public string $uri,
        public SurfaceDefinition $surface,
        public SurfaceDefinition|null $window,
        public string $componentFile,
        public string|null $windowFile,
        public string $propName,
        public array $slots,
        private array $checks,
    ) {}

    public static function of(DomainClient $owner, Page $page, SurfaceAttributeMap|null $policies = null): self
    {
        $key = $owner->fullKey('page', $page->key);
        $path = RoutePath::of($key, $page->path);

        if ($page->visibility !== null) {
            $owner->assertImplements($key, $page->visibility, VisibilityCheck::class);
        }

        if ($page->homePosition !== null && $page->window === null) {
            throw InvalidPageDeclaration::missingWindow($key);
        }

        $policy = $policies?->forPage($page->surface->type);
        $record = $policy?->recordScope;

        if ($record !== null && ! $path->hasParameter($record->parameter)) {
            throw InvalidPageDeclaration::missingRecordParameter($key, $record->parameter);
        }

        $checks = $policy?->checks ?? [];

        if ($page->visibility !== null) {
            $checks[] = $page->visibility;
        }

        return new self(
            owner: $owner,
            page: $page,
            key: $key,
            path: $path,
            uri: $owner->uri($path),
            surface: $page->surface,
            window: $page->window,
            componentFile: $owner->presentationFile($key, $page->surface->component, $page->isDeclared),
            windowFile: $page->window === null ? null : $owner->componentFile($key, $page->window->component),
            propName: 'window_'.str_replace(['.', '-'], '_', $key),
            slots: self::checkedSlots($owner, $key, $path, $page->slots),
            checks: $checks,
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
        return $this->checks;
    }

    /**
     * @param  list<Slot>  $slots
     * @return array<string, Slot>
     */
    private static function checkedSlots(DomainClient $owner, string $page, RoutePath $path, array $slots): array
    {
        $checked = [];

        foreach ($slots as $slot) {
            $slotKey = $owner->fullKey('slot', $slot->key);

            if ($slot->recordParameter !== null && ! $path->hasParameter($slot->recordParameter)) {
                throw ClientSlotMismatch::parameterMissing($page, $slotKey, $slot->recordParameter);
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
        return $this->owner->presentationName($this->surface->component, $this->page->isDeclared);
    }

    public function windowComponentName(): string|null
    {
        return $this->window === null ? null : $this->owner->presentationName($this->window->component, false);
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
