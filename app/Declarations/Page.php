<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Access\Contracts\VisibilityCheck;
use App\Navigation\Contracts\PageOption;
use App\Navigation\Declarations\Loader;
use App\Navigation\Enums\Icon;
use App\Web\Creation\Buildable;
use App\Web\Creation\SurfaceDefinition;
use App\Web\Declarations\Slot;
use App\Web\Enums\PageDestination;
use App\Web\Enums\PageSkeleton;
use App\Web\Enums\WindowPlace;
use Closure;
use Spatie\LaravelData\Optional;

/**
 * A page a domain owns, keyed within its domain: where it lives under the domain's prefix, the page and optional window types
 * that draw it, how it shows on Home, and the slots, actions and loaders it offers. Each change returns a new page.
 */
final class Page
{
    /** @use Buildable<PageFields> */
    use Buildable;

    protected const string FIELDS = PageFields::class;

    /**
     * @param  int|null  $homePosition  null when the page is not in Home's Default preset
     * @param  list<PageOption>  $options
     * @param  list<Slot>  $slots
     * @param  list<ActionRoute>  $actions
     * @param  list<Loader>  $loaders
     * @param  class-string<VisibilityCheck>|null  $visibility  null when everyone signed in sees the page
     * @param  WindowPlace|Optional  $place  absent when a work layout has no place for the window
     */
    public function __construct(
        public readonly string $key,
        public readonly string $title,
        public readonly Icon $icon,
        public readonly string $path,
        public readonly SurfaceDefinition $surface,
        public readonly FloatSize $floatSize,
        public readonly SurfaceDefinition|null $window = null,
        public readonly PageDestination $opensIn = PageDestination::Page,
        public readonly PageSkeleton $skeleton = PageSkeleton::Rows,
        public readonly int|null $homePosition = null,
        public readonly array $options = [],
        public readonly array $slots = [],
        public readonly array $actions = [],
        public readonly array $loaders = [],
        public readonly string|null $visibility = null,
        public readonly bool $isDeclared = false,
        public readonly WindowPlace|Optional $place = new Optional(),
    ) {}

    /**
     * The path relative to the domain's prefix, with {name} route parameters; an empty path is the prefix itself.
     */
    public function at(string $path): self
    {
        return clone ($this, ['path' => $path]);
    }

    public function inInspector(): self
    {
        return clone ($this, ['opensIn' => PageDestination::Inspector]);
    }

    public function loadingAs(PageSkeleton $skeleton): self
    {
        return clone ($this, ['skeleton' => $skeleton]);
    }

    public function onHome(int $position): self
    {
        return clone ($this, ['homePosition' => $position]);
    }

    public function placedAs(WindowPlace $place): self
    {
        return clone ($this, ['place' => $place]);
    }

    public function floating(FloatSize $size): self
    {
        return clone ($this, ['floatSize' => $size]);
    }

    public function options(PageOption ...$options): self
    {
        return clone ($this, ['options' => array_values($options)]);
    }

    /**
     * The places on the page where sections of any domain may show, added in the scope.
     *
     * @param  Closure(PageSlots): mixed  $scope
     */
    public function slots(Closure $scope): self
    {
        $slots = new PageSlots();
        $scope($slots);

        return clone ($this, ['slots' => $slots->slots()]);
    }

    /**
     * The actions the page offers, added in the scope.
     *
     * @param  Closure(PageActions): mixed  $scope
     */
    public function actions(Closure $scope): self
    {
        $actions = new PageActions();
        $scope($actions);

        return clone ($this, ['actions' => $actions->routes()]);
    }

    /**
     * The reads the page offers beside its own result, each guarded by the page's visibility as its actions are,
     * added in the scope.
     *
     * @param  Closure(PageLoaders): mixed  $scope
     */
    public function loaders(Closure $scope): self
    {
        $loaders = new PageLoaders();
        $scope($loaders);

        return clone ($this, ['loaders' => $loaders->loaders()]);
    }

    /**
     * @param  class-string<VisibilityCheck>  $check
     */
    public function visibleWhen(string $check): self
    {
        return clone ($this, ['visibility' => $check]);
    }
}
