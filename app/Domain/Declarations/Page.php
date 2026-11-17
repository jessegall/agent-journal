<?php

declare(strict_types=1);

namespace App\Domain\Declarations;

use App\Domain\Contracts\PageOption;
use App\Domain\Contracts\PageReader;
use App\Domain\Contracts\VisibilityCheck;
use App\Domain\Enums\Icon;
use App\Domain\Enums\PageDestination;
use App\Domain\Enums\PageSkeleton;
use App\Domain\Exceptions\InvalidPageDeclaration;
use Spatie\LaravelData\Data;

/**
 * A page a domain owns, keyed within its domain: where it lives under the domain's prefix, the reader and component
 * that draw it, how it shows on Home, and the slots and actions it offers. Each change returns a new page.
 */
final class Page
{
    /**
     * @param  class-string<PageReader>  $reader
     * @param  class-string<Data>  $dataClass  the Data class the reader's read method declares
     * @param  int|null  $homePosition  null when the page is not in Home's Default preset
     * @param  list<PageOption>  $options
     * @param  list<Slot>  $slots
     * @param  list<ActionRoute>  $actions
     * @param  class-string<VisibilityCheck>|null  $visibility  null when everyone signed in sees the page
     */
    private function __construct(
        public private(set) string $key,
        public private(set) string $title,
        public private(set) Icon $icon,
        public private(set) string $path,
        public private(set) string $reader,
        public private(set) string $dataClass,
        public private(set) string $component,
        public private(set) FloatSize $floatSize,
        public private(set) PageDestination $opensIn = PageDestination::Page,
        public private(set) PageSkeleton $skeleton = PageSkeleton::Rows,
        public private(set) int|null $homePosition = null,
        public private(set) array $options = [],
        public private(set) array $slots = [],
        public private(set) array $actions = [],
        public private(set) string|null $visibility = null,
    ) {}

    /**
     * A page at the path of its own key, read by the reader and drawn by the component under the domain's Resources/js.
     *
     * @param  class-string<PageReader>  $reader
     */
    public static function make(string $key, string $title, Icon $icon, string $reader, string $component): self
    {
        $dataClass = ReaderDataClass::of($reader);

        if ($dataClass === null) {
            throw InvalidPageDeclaration::readerReturnsNoData($key, $reader);
        }

        return new self($key, $title, $icon, $key, $reader, $dataClass, $component, FloatSize::standard());
    }

    /**
     * The path relative to the domain's prefix, with {name} route parameters; an empty path is the prefix itself.
     */
    public function at(string $path): self
    {
        $page = clone $this;
        $page->path = $path;

        return $page;
    }

    public function inInspector(): self
    {
        $page = clone $this;
        $page->opensIn = PageDestination::Inspector;

        return $page;
    }

    public function loadingAs(PageSkeleton $skeleton): self
    {
        $page = clone $this;
        $page->skeleton = $skeleton;

        return $page;
    }

    public function onHome(int $position): self
    {
        $page = clone $this;
        $page->homePosition = $position;

        return $page;
    }

    public function floating(FloatSize $size): self
    {
        $page = clone $this;
        $page->floatSize = $size;

        return $page;
    }

    public function options(PageOption ...$options): self
    {
        $page = clone $this;
        $page->options = array_values($options);

        return $page;
    }

    public function slots(Slot ...$slots): self
    {
        $page = clone $this;
        $page->slots = array_values($slots);

        return $page;
    }

    public function actions(ActionRoute ...$actions): self
    {
        $page = clone $this;
        $page->actions = array_values($actions);

        return $page;
    }

    /**
     * @param  class-string<VisibilityCheck>  $check
     */
    public function visibleWhen(string $check): self
    {
        $page = clone $this;
        $page->visibility = $check;

        return $page;
    }
}
