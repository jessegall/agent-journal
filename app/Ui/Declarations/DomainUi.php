<?php

declare(strict_types=1);

namespace App\Ui\Declarations;

use App\Files\Exceptions\FileMissing;
use App\Files\Exceptions\FileOutsidePlaces;
use App\Files\Exceptions\FilePathInvalid;
use App\Files\Exceptions\FolderClosed;
use App\Files\Exceptions\LinkLeavesPlace;
use App\Files\Exceptions\LinkLoop;
use App\Files\Support\CodeFiles;
use App\Ui\Contracts\NavigationProvider;
use App\Ui\Contracts\PageProvider;
use App\Ui\Contracts\SectionProvider;
use App\Ui\Exceptions\UiComponentMissing;
use App\Ui\Exceptions\UiKeyInvalid;
use App\Ui\Exceptions\UiResolverInvalid;
use Illuminate\Support\Str;

/**
 * One installed domain as the UI sees it: the key its declarations are prefixed with, its namespace, its Vue root and
 * what it declares. A domain that declares nothing has empty lists.
 */
final readonly class DomainUi
{
    /**
     * @param  list<Page>  $pages
     * @param  list<NavigationItem>  $navigation
     * @param  list<Section>  $sections
     */
    private function __construct(
        public string $name,
        public string $key,
        public string $namespace,
        public string $scriptFolder,
        public array $pages,
        public array $navigation,
        public array $sections,
    ) {}

    /**
     * Reads what a domain or module declares through PageProvider, NavigationProvider and SectionProvider, given its
     * name, namespace and folder.
     */
    public static function of(object $domain, string $name, string $namespace, string $scriptFolder): self
    {
        return self::declaring(
            $name,
            $namespace,
            $scriptFolder,
            pages: $domain instanceof PageProvider ? $domain->pages() : [],
            navigation: $domain instanceof NavigationProvider ? $domain->navigation() : [],
            sections: $domain instanceof SectionProvider ? $domain->sections() : [],
        );
    }

    /**
     * @param  list<Page>  $pages
     * @param  list<NavigationItem>  $navigation
     * @param  list<Section>  $sections
     */
    public static function declaring(
        string $name,
        string $namespace,
        string $scriptFolder,
        array $pages = [],
        array $navigation = [],
        array $sections = [],
    ): self {
        return new self(
            name: $name,
            key: Str::kebab($name),
            namespace: $namespace,
            scriptFolder: $scriptFolder,
            pages: $pages,
            navigation: $navigation,
            sections: $sections,
        );
    }

    /**
     * The key prefixed with the domain's key, such as plans.inspector for inspector in Plans.
     */
    public function fullKey(string $type, string $key): string
    {
        if (preg_match('/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/', $key) !== 1) {
            throw UiKeyInvalid::notLocal($this->name, $type, $key);
        }

        return "{$this->key}.{$key}";
    }

    /**
     * The URI of a path under the domain's prefix, without a leading slash.
     */
    public function uri(RoutePath $path): string
    {
        return rtrim("{$this->key}/{$path->path}", '/');
    }

    /**
     * The real path of a component named relative to the domain's script folder; the funnel refuses one that climbs out
     * or links out of the project.
     */
    public function componentFile(string $declaration, string $component): string
    {
        if (! str_ends_with($component, '.vue')) {
            throw UiComponentMissing::outsideOwner($declaration, $component);
        }

        $code = CodeFiles::ofProcess();

        try {
            return $code->realPathOf($code->projectPathOf($this->scriptFolder)->child($component));
        } catch (FilePathInvalid|FileOutsidePlaces|FolderClosed|LinkLeavesPlace) {
            throw UiComponentMissing::outsideOwner($declaration, $component);
        } catch (FileMissing|LinkLoop) {
            throw UiComponentMissing::at($declaration, "{$this->scriptFolder}/{$component}");
        }
    }

    /**
     * Refuses a class named by a declaration that does not implement the interface its role needs.
     *
     * @param  class-string  $interface
     */
    public function assertImplements(string $declaration, string $className, string $interface): void
    {
        if (! is_subclass_of($className, $interface)) {
            throw UiResolverInvalid::notA($declaration, $className, $interface);
        }
    }

    /**
     * Refuses an action controller that is not an invokable class in this domain's namespace.
     */
    public function assertInvokableController(string $declaration, string $controller): void
    {
        if (! str_starts_with($controller, $this->namespace.'\\') || ! method_exists($controller, '__invoke')) {
            throw UiResolverInvalid::controllerNotOwned($declaration, $controller);
        }
    }
}
