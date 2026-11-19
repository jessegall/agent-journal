<?php

declare(strict_types=1);

namespace App\Ui\Declarations;

use App\Ui\Contracts\ProvidesNavigation;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Contracts\ProvidesSections;
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
     * Reads what a domain or module declares through ProvidesPages, ProvidesNavigation and ProvidesSections, given its
     * name, namespace and folder.
     */
    public static function of(object $domain, string $name, string $namespace, string $scriptFolder): self
    {
        return self::declaring(
            $name,
            $namespace,
            $scriptFolder,
            pages: $domain instanceof ProvidesPages ? $domain->pages() : [],
            navigation: $domain instanceof ProvidesNavigation ? $domain->navigation() : [],
            sections: $domain instanceof ProvidesSections ? $domain->sections() : [],
        );
    }

    /**
     * @param  list<Page>  $pages
     * @param  list<NavigationItem>  $navigation
     * @param  list<Section>  $sections
     */
    public static function declaring(string $name, string $namespace, string $scriptFolder, array $pages = [], array $navigation = [], array $sections = []): self
    {
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
     * The real path of a component named relative to the domain's script folder, refused when it lies elsewhere.
     */
    public function componentFile(string $declaration, string $component): string
    {
        if (! str_ends_with($component, '.vue') || str_starts_with($component, '/') || in_array('..', explode('/', $component), true)) {
            throw UiComponentMissing::outsideOwner($declaration, $component);
        }

        $file = realpath("{$this->scriptFolder}/{$component}");

        if ($file === false) {
            throw UiComponentMissing::at($declaration, "{$this->scriptFolder}/{$component}");
        }

        if (! str_starts_with($file, realpath($this->scriptFolder).DIRECTORY_SEPARATOR)) {
            throw UiComponentMissing::outsideOwner($declaration, $component);
        }

        return $file;
    }

    /**
     * Refuses a class named by a declaration that does not implement the interface its role needs.
     *
     * @param  class-string  $interface
     */
    public function checkImplements(string $declaration, string $className, string $interface): void
    {
        if (! is_subclass_of($className, $interface)) {
            throw UiResolverInvalid::notA($declaration, $className, $interface);
        }
    }

    /**
     * Refuses an action controller that is not an invokable class in this domain's namespace.
     */
    public function checkController(string $declaration, string $controller): void
    {
        if (! str_starts_with($controller, $this->namespace.'\\') || ! method_exists($controller, '__invoke')) {
            throw UiResolverInvalid::controllerNotOwned($declaration, $controller);
        }
    }
}
