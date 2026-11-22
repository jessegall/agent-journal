<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\Drivers\NativePartProvider;
use App\Contracts\Navigation\MenuProvider;
use App\Contracts\Navigation\NavigationProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Navigation\SectionProvider;
use App\Contracts\Navigation\SidebarGroupProvider;
use App\Contracts\Records\TypeProvider;
use App\Enums\Place;
use App\Exceptions\FileMissing;
use App\Exceptions\FileOutsidePlaces;
use App\Exceptions\FilePathInvalid;
use App\Exceptions\FolderClosed;
use App\Exceptions\LinkLeavesPlace;
use App\Exceptions\LinkLoop;
use App\Exceptions\UiComponentMissing;
use App\Exceptions\UiKeyInvalid;
use App\Exceptions\UiResolverInvalid;
use App\Support\CodeFiles;
use App\Support\Reflector;
use App\Values\FilePath;
use Illuminate\Support\Str;

/**
 * One installed domain as the UI sees it: the key its declarations are prefixed with, its namespace, its Vue root and
 * what it declares. A domain that declares nothing has empty lists.
 */
final readonly class DomainUi
{
    /**
     * The file name of the shared renderer of declared layouts.
     */
    public const string DECLARED_LAYOUT = 'DeclaredLayout.vue';

    /**
     * @param  list<Page>  $pages
     * @param  list<NavigationItem>  $navigation
     * @param  list<Section>  $sections
     * @param  list<string>  $nativeParts
     * @param  list<SidebarGroup>  $sidebarGroups
     * @param  list<Menu>  $menus
     * @param  list<MenuItem>  $menuItems
     * @param  list<class-string>  $types
     */
    private function __construct(
        public string $name,
        public string $key,
        public string $namespace,
        public string $scriptFolder,
        public array $pages,
        public array $navigation,
        public array $sections,
        public array $nativeParts,
        public array $sidebarGroups,
        public array $menus,
        public array $menuItems,
        public array $types,
    ) {}

    /**
     * Reads what one of Core's page modules declares, its scripts in its own folder under Core's resources/js.
     */
    public static function ofCore(object $module, string $name, string $scriptFolder): self
    {
        return self::of($module, $name, 'App', dirname(__DIR__, 2).'/resources/js/'.$scriptFolder);
    }

    /**
     * Reads what a domain or module declares through PageProvider, NavigationProvider, SectionProvider,
     * NativePartProvider, SidebarGroupProvider, MenuProvider and TypeProvider, given its name, namespace and folder.
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
            nativeParts: $domain instanceof NativePartProvider ? $domain->nativeParts() : [],
            sidebarGroups: $domain instanceof SidebarGroupProvider ? $domain->sidebarGroups() : [],
            menus: $domain instanceof MenuProvider ? $domain->menus() : [],
            menuItems: $domain instanceof MenuProvider ? $domain->menuItems() : [],
            types: $domain instanceof TypeProvider ? $domain->types() : [],
        );
    }

    /**
     * @param  list<Page>  $pages
     * @param  list<NavigationItem>  $navigation
     * @param  list<Section>  $sections
     * @param  list<string>  $nativeParts
     * @param  list<SidebarGroup>  $sidebarGroups
     * @param  list<Menu>  $menus
     * @param  list<MenuItem>  $menuItems
     * @param  list<class-string>  $types
     */
    public static function declaring(
        string $name,
        string $namespace,
        string $scriptFolder,
        array $pages = [],
        array $navigation = [],
        array $sections = [],
        array $nativeParts = [],
        array $sidebarGroups = [],
        array $menus = [],
        array $menuItems = [],
        array $types = [],
    ): self {
        return new self(
            name: $name,
            key: Str::kebab($name),
            namespace: $namespace,
            scriptFolder: $scriptFolder,
            pages: $pages,
            navigation: $navigation,
            sections: $sections,
            nativeParts: $nativeParts,
            sidebarGroups: $sidebarGroups,
            menus: $menus,
            menuItems: $menuItems,
            types: $types,
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
     * The file that draws a page or section: its own component in the domain's script folder, or for a declared
     * layout the one shared renderer of the project's script folder.
     */
    public function presentationFile(string $declaration, string $component, bool $isDeclared): string
    {
        if (! $isDeclared) {
            return $this->componentFile($declaration, $component);
        }

        return CodeFiles::ofProcess()->realPathOf(
            FilePath::in(Place::Project, 'resources/js/components/layout/'.self::DECLARED_LAYOUT),
        );
    }

    /**
     * The entry of a page or section in the browser's component list: every declared layout shares the renderer's.
     */
    public function presentationName(string $component, bool $isDeclared): string
    {
        $owner = $isDeclared ? 'layout' : $this->key;

        return $owner.'/'.preg_replace('/\.vue$/', '', $component);
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
        } catch (FilePathInvalid|FileOutsidePlaces|FolderClosed|LinkLeavesPlace $refusal) {
            throw UiComponentMissing::outsideOwner($declaration, $component, $refusal);
        } catch (FileMissing|LinkLoop $refusal) {
            throw UiComponentMissing::at($declaration, "{$this->scriptFolder}/{$component}", $refusal);
        }
    }

    /**
     * Refuses a class named by a declaration that does not implement the interface its role needs.
     *
     * @param  class-string  $interface
     */
    public function assertImplements(string $declaration, string $className, string $interface): void
    {
        if (! Reflector::factory()->isSubclassOf($className, $interface)) {
            throw UiResolverInvalid::notA($declaration, $className, $interface);
        }
    }

    /**
     * Whether the class is in this owner's namespace: App for Core's page owners, laid out by role (doc 107), or the
     * package's own.
     */
    public function owns(string $className): bool
    {
        return str_starts_with($className, $this->namespace.'\\');
    }

    /**
     * Refuses an action controller that is not an invokable class of the declaring owner.
     */
    public function assertInvokableController(string $declaration, string $controller): void
    {
        if (! $this->owns($controller) || ! Reflector::exists($controller)
            || ! Reflector::of($controller)->hasMethod('__invoke')) {
            throw UiResolverInvalid::controllerNotOwned($declaration, $controller);
        }
    }
}
