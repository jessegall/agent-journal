<?php

declare(strict_types=1);

namespace App\Support\Types;

use App\Navigation\Contracts\PresentsLayout;
use App\Reflection\Contracts\ReflectorFactory;
use App\Support\ClientDeclarations;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Declarations\RegisteredPage;
use App\Web\Enums\PageDestination;
use Illuminate\Support\Str;

/**
 * The TypeScript props of every declared page and of Home's windows, each result typed with its reader's own Data,
 * and one check per page component that fails the type check when the component expects other props.
 */
final readonly class PagePropTypes
{
    public function __construct(
        private ClientDeclarations $declarations,
        private TypeOwners $owners,
        private ReflectorFactory $reflector,
    ) {}

    /**
     * The props of each page by its type name, as TypeScript object members.
     *
     * @return array<string, list<string>>
     */
    public function pageProps(): array
    {
        $props = [];

        $inspectors = $this->resultOf(
            array_values(
                array_filter(
                    $this->declarations->pages(),
                    fn (RegisteredPage $page) => $page->page->opensIn === PageDestination::Inspector,
                ),
            ),
        );

        foreach ($this->declarations->pages() as $page) {
            $members = ['page: WindowResult<'.$this->dataName($page->surface->type).'>'];

            foreach ($this->declarations->sections() as $section) {
                if ($section->host->key === $page->key) {
                    $members[] = "{$section->propName}?: WindowResult<".$this->dataName(
                        $section->resolver->dataClass,
                    ).'> | null';
                }
            }

            if ($inspectors !== null) {
                $members[] = "inspector?: WindowResult<{$inspectors}> | null";
            }

            $props[$this->typeName($page)] = $members;
        }

        return $props;
    }

    /**
     * Home's optional window props.
     *
     * @return list<string>
     */
    public function windowProps(): array
    {
        $props = [];

        foreach ($this->declarations->pages() as $page) {
            if ($page->window !== null) {
                $type = $this->dataName($page->window->type);
                $props[] = "{$page->propName}?: WindowResult<{$type}>";
            }
        }

        return $props;
    }

    /**
     * The Data types to import, by owner.
     *
     * @return array<string, list<string>>
     */
    public function imports(): array
    {
        $imports = [];

        $types = [];

        foreach ($this->declarations->pages() as $page) {
            $types[] = $page->surface->type;

            if ($page->window !== null) {
                $types[] = $page->window->type;
            }
        }

        foreach ($this->declarations->sections() as $section) {
            $types[] = $section->resolver->dataClass;
        }

        foreach ($types as $type) {
            $owner = $this->reflector->make($type)->isSubclassOf(PresentsLayout::class)
                ? $this->owners->ownerOf(DeclaredLayoutData::class)
                : $this->owners->ownerOf($type);

            $imports[$owner][] = $this->dataName($type);
        }

        ksort($imports);

        return array_map(fn (array $names) => array_values(array_unique($names)), $imports);
    }

    /**
     * The TypeScript name of the Data a page's component receives as its one data prop.
     */
    public function dataTypeOf(RegisteredPage $page): string
    {
        return $this->dataName($page->surface->type);
    }

    public function typeName(RegisteredPage $page): string
    {
        return Str::studly(str_replace('.', '-', $page->key)).'PageProps';
    }

    /**
     * @param  class-string  $class
     */
    private function dataName(string $class): string
    {
        if ($this->reflector->make($class)->isSubclassOf(PresentsLayout::class)) {
            return 'DeclaredLayoutData';
        }

        return class_basename($class);
    }

    /**
     * @param  list<RegisteredPage>  $pages
     */
    private function resultOf(array $pages): string|null
    {
        $names = array_values(
            array_unique(array_map(fn (RegisteredPage $page) => $this->dataName($page->surface->type), $pages)),
        );

        if ($names === []) {
            return null;
        }

        return implode(' | ', $names);
    }
}
