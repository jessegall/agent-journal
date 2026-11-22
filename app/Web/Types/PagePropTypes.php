<?php

declare(strict_types=1);

namespace App\Web\Types;

use App\Reflection\Support\Reflector;
use App\Ui\Contracts\PresentsLayout;
use App\Ui\Declarations\RegisteredPage;
use App\Ui\Enums\PageDestination;
use App\Ui\Support\UiDeclarations;
use Illuminate\Support\Str;

/**
 * The TypeScript props of every declared page and of Home's windows, each result typed with its reader's own Data,
 * and one check per page component that fails the type check when the component expects other props.
 */
final readonly class PagePropTypes
{
    public function __construct(
        private UiDeclarations $declarations,
        private TypeOwners $owners,
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
            $members = ['page: WindowResult<'.$this->dataName($page->resolver->dataClass).'>'];

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
        return array_values(array_map(
            fn (RegisteredPage $page) => "{$page->propName}?: WindowResult<".$this->dataName(
                $page->resolver->dataClass,
            ).'>',
            array_filter(
                $this->declarations->pages(),
                fn (RegisteredPage $page) => $page->page->opensIn === PageDestination::Page,
            ),
        ));
    }

    /**
     * The Data types to import, by owner.
     *
     * @return array<string, list<string>>
     */
    public function imports(): array
    {
        $imports = [];

        foreach ([...$this->declarations->pages(), ...$this->declarations->sections()] as $declaration) {
            $imports[$this->owners->ownerOf(
                $declaration->resolver->dataClass,
            )][] = $this->dataName($declaration->resolver->dataClass);
        }

        ksort($imports);

        return array_map(fn (array $names) => array_values(array_unique($names)), $imports);
    }

    /**
     * The TypeScript name of the Data a page's component receives as its one data prop.
     */
    public function dataTypeOf(RegisteredPage $page): string
    {
        return $this->dataName($page->resolver->dataClass);
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
        return Reflector::factory()->isSubclassOf($class, PresentsLayout::class)
            ? 'DeclaredLayoutData'
            : class_basename($class);
    }

    /**
     * @param  list<RegisteredPage>  $pages
     */
    private function resultOf(array $pages): string|null
    {
        $names = array_values(
            array_unique(array_map(fn (RegisteredPage $page) => $this->dataName($page->resolver->dataClass), $pages)),
        );

        return $names === [] ? null : implode(' | ', $names);
    }
}
