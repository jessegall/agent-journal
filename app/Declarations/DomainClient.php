<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\Drivers\NativePartProvider;
use App\Contracts\Navigation\LoaderProvider;
use App\Contracts\Navigation\MenuProvider;
use App\Contracts\Navigation\NavigationProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Navigation\SectionProvider;
use App\Contracts\Navigation\SidebarGroupProvider;
use App\Contracts\Records\TypeProvider;
use App\Enums\Files\Place;
use App\Exceptions\ClientComponentMissing;
use App\Exceptions\ClientKeyInvalid;
use App\Exceptions\ClientResolverInvalid;
use App\Exceptions\FileMissing;
use App\Exceptions\FileOutsidePlaces;
use App\Exceptions\FilePathInvalid;
use App\Exceptions\FolderClosed;
use App\Exceptions\LinkLeavesPlace;
use App\Exceptions\LinkLoop;
use App\Support\CodeFiles;
use App\Support\DeclaredType;
use App\Support\ReflectedType;
use App\Values\FilePath;
use Illuminate\Support\Str;
use Spatie\LaravelData\Data;

/**
 * One installed domain as the client sees it: the key its declarations are prefixed with, its namespace, its Vue root
 * and what it declares. A domain that declares nothing has empty lists.
 */
final readonly class DomainClient
{
    /**
     * The file name of the shared renderer of declared layouts.
     */
    public const string DECLARED_LAYOUT = 'DeclaredLayout.vue';

    /**
     * The namespace of Core's page owners, which share it and so name their types in a list.
     */
    private const string CORE_NAMESPACE = 'App';

    /**
     * @param  list<Page>  $pages
     * @param  list<NavigationItem>  $navigation
     * @param  list<Section>  $sections
     * @param  list<string>  $nativeParts
     * @param  list<SidebarGroup>  $sidebarGroups
     * @param  list<Menu>  $menus
     * @param  list<MenuItem>  $menuItems
     * @param  list<class-string>  $types
     * @param  list<Loader>  $loaders  the loaders no page guards
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
        public array $loaders,
    ) {}

    /**
     * Reads what one of Core's page modules declares, its scripts in its own folder under Core's resources/js.
     */
    public static function ofCore(object $module, string $name, string $scriptFolder): self
    {
        return self::of($module, $name, self::CORE_NAMESPACE, dirname(__DIR__, 2).'/resources/js/'.$scriptFolder);
    }

    /**
     * Reads what a domain or module declares through PageProvider, NavigationProvider, SectionProvider,
     * NativePartProvider, SidebarGroupProvider, MenuProvider, TypeProvider and LoaderProvider, given its name,
     * namespace and folder.
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
            loaders: $domain instanceof LoaderProvider ? $domain->loaders() : [],
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
     * @param  list<Loader>  $loaders
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
        array $loaders = [],
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
            loaders: $loaders,
        );
    }

    /**
     * The key prefixed with the domain's key, such as plans.inspector for inspector in Plans.
     */
    public function fullKey(string $type, string $key): string
    {
        if (preg_match('/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/', $key) !== 1) {
            throw ClientKeyInvalid::notLocal($this->name, $type, $key);
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
            FilePath::in(Place::Project, 'resources/js/pages/layout/'.self::DECLARED_LAYOUT),
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
     * The real path of a component named relative to the owner's page folder, pages/<key> of its script folder; the
     * funnel refuses one that escapes its root or links out of the project.
     */
    public function componentFile(string $declaration, string $component): string
    {
        if (! str_ends_with($component, '.vue')) {
            throw ClientComponentMissing::outsideOwner($declaration, $component);
        }

        $code = CodeFiles::ofProcess();

        try {
            return $code->realPathOf($code->projectPathOf($this->pageFolder())->child($component));
        } catch (FilePathInvalid|FileOutsidePlaces|FolderClosed|LinkLeavesPlace $refusal) {
            throw ClientComponentMissing::outsideOwner($declaration, $component, $refusal);
        } catch (FileMissing|LinkLoop $refusal) {
            throw ClientComponentMissing::at($declaration, "{$this->pageFolder()}/{$component}", $refusal);
        }
    }

    /**
     * The folder of the owner's page: pages/<key> under its script folder, holding the components it declares and,
     * in partials, the ones only they use.
     */
    public function pageFolder(): string
    {
        return "{$this->scriptFolder}/pages/{$this->key}";
    }

    /**
     * Refuses a class named by a declaration that does not implement the interface its role needs.
     *
     * @param  class-string  $interface
     */
    public function assertImplements(string $declaration, string $className, string $interface): void
    {
        if (! ReflectedType::factory()->isSubclassOf($className, $interface)) {
            throw ClientResolverInvalid::notA($declaration, $className, $interface);
        }
    }

    /**
     * Whether the class is in this owner's namespace: App for Core's page owners, laid out by role, or the
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
        if (! $this->owns($controller) || ! ReflectedType::exists($controller)
            || ! ReflectedType::of($controller)->hasMethod('__invoke')) {
            throw ClientResolverInvalid::controllerNotOwned($declaration, $controller);
        }
    }

    /**
     * Refuses a loader reader that is not an invokable class of the declaring owner taking exactly one Data and
     * returning a Data, both types this owner generates, so the generated imports resolve.
     *
     * @param  class-string  $reader
     */
    public function assertLoader(string $declaration, string $reader): void
    {
        if (! $this->owns($reader) || ! ReflectedType::exists($reader)
            || ! ReflectedType::of($reader)->hasMethod('__invoke')) {
            throw ClientResolverInvalid::loaderNotOwned($declaration, $reader);
        }

        $invoke = ReflectedType::of($reader)->method('__invoke');
        $input = count($invoke->parameters()) === 1 ? $invoke->firstParameterClass()->getOrElse('') : '';
        $answer = $invoke->returnType()
            ->filter(fn (DeclaredType $type) => $type->isNamed() && ! $type->isBuiltin() && ! $type->allowsNull)
            ->map(fn (DeclaredType $type) => $type->name())
            ->getOrElse('');

        foreach ([$input, $answer] as $dataClass) {
            if ($dataClass === '' || ! ReflectedType::factory()->isSubclassOf($dataClass, Data::class)) {
                throw ClientResolverInvalid::loaderShape($declaration, $reader);
            }

            if (! $this->ownsType($dataClass)) {
                throw ClientResolverInvalid::loaderTypeNotOwned($declaration, $dataClass, $this->name);
            }
        }
    }

    /**
     * Whether a class's generated type is this owner's, as the type owners read it: one its types list names, or, for
     * a domain, one in its namespace.
     */
    private function ownsType(string $className): bool
    {
        return in_array($className, $this->types, true)
            || ($this->namespace !== self::CORE_NAMESPACE && $this->owns($className));
    }
}
