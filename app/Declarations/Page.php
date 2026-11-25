<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\Authorization\VisibilityCheck;
use App\Contracts\Navigation\PageOption;
use App\Contracts\Navigation\PageResolver;
use App\Contracts\Navigation\PresentsLayout;
use App\Enums\Navigation\Icon;
use App\Enums\Web\PageDestination;
use App\Enums\Web\PageSkeleton;
use App\Enums\Web\WindowPlace;
use App\Exceptions\InvalidPageDeclaration;
use App\Support\Reflector;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * A page a domain owns, keyed within its domain: where it lives under the domain's prefix, the resolver and component
 * that draw it, how it shows on Home, and the slots and actions it offers. Each change returns a new page.
 */
final class Page
{
    /**
     * @param  class-string<PageResolver>  $resolver
     * @param  class-string<Data>  $dataClass  the Data class the resolver's read method declares
     * @param  int|null  $homePosition  null when the page is not in Home's Default preset
     * @param  list<PageOption>  $options
     * @param  list<Slot>  $slots
     * @param  list<ActionRoute>  $actions
     * @param  class-string<VisibilityCheck>|null  $visibility  null when everyone signed in sees the page
     * @param  WindowPlace|Optional  $place  absent when a work layout has no place for the window
     */
    private function __construct(
        public readonly string $key,
        public readonly string $title,
        public readonly Icon $icon,
        public readonly string $path,
        public readonly string $resolver,
        public readonly string $dataClass,
        public readonly string $component,
        public readonly FloatSize $floatSize,
        public readonly PageDestination $opensIn = PageDestination::Page,
        public readonly PageSkeleton $skeleton = PageSkeleton::Rows,
        public readonly int|null $homePosition = null,
        public readonly array $options = [],
        public readonly array $slots = [],
        public readonly array $actions = [],
        public readonly string|null $visibility = null,
        public readonly bool $isDeclared = false,
        public readonly WindowPlace|Optional $place = new Optional(),
    ) {}

    /**
     * A page at the path of its own key, read by the resolver and drawn by the component in the domain's script folder
     * (resources/js).
     *
     * @param  class-string<PageResolver>  $resolver
     */
    public static function make(string $key, string $title, Icon $icon, string $resolver, string $component): self
    {
        $dataClass = ResolverDataClass::of($resolver);

        if ($dataClass === null) {
            throw InvalidPageDeclaration::resolverReturnsNoData($key, $resolver);
        }

        return new self($key, $title, $icon, $key, $resolver, $dataClass, $component, FloatSize::standard());
    }

    /**
     * A page whose reader builds a declared layout of catalogue parts, drawn by the one shared renderer instead of a
     * component of its own; its key, routes and placement work as any page's.
     *
     * @param  class-string<PageResolver>  $resolver
     */
    public static function layout(string $key, string $title, Icon $icon, string $resolver): self
    {
        $result = (string) ResolverDataClass::of($resolver);

        if ($result === '' || ! Reflector::factory()->isSubclassOf($result, PresentsLayout::class)) {
            throw InvalidPageDeclaration::readerReturnsNoLayout($key, $resolver);
        }

        return new self(
            $key,
            $title,
            $icon,
            $key,
            $resolver,
            $result,
            DomainClient::DECLARED_LAYOUT,
            FloatSize::standard(),
            isDeclared: true,
        );
    }

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

    public function slots(Slot ...$slots): self
    {
        return clone ($this, ['slots' => array_values($slots)]);
    }

    public function actions(ActionRoute ...$actions): self
    {
        return clone ($this, ['actions' => array_values($actions)]);
    }

    /**
     * @param  class-string<VisibilityCheck>  $check
     */
    public function visibleWhen(string $check): self
    {
        return clone ($this, ['visibility' => $check]);
    }
}
