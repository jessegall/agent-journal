<?php

declare(strict_types=1);

namespace Tests\Unit\Web;

use App\Declarations\Page;
use App\Files\Contracts\Files;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Declarations\Loader;
use App\Navigation\Enums\Icon;
use App\Reflection\Contracts\ReflectorFactory;
use App\Support\ClientDeclarations;
use App\Support\ClientManifest;
use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use App\Support\Types\LoaderTypes;
use App\Support\Types\PagePropTypes;
use App\Support\Types\TypeOwners;
use Illuminate\Support\Facades\File;
use Tests\Fixtures\ClientDeclarations\Library\BooksResolver;
use Tests\Fixtures\ClientDeclarations\Library\LibraryDomain;
use Tests\Fixtures\ClientDeclarations\Library\ShelfRowsData;
use Tests\Fixtures\ClientDeclarations\Library\ShelfRowsInput;
use Tests\Fixtures\ClientDeclarations\Library\ShelfRowsLoader;
use Tests\Fixtures\ClientDeclarations\Shelf\ShelfDomain;
use Tests\Fixtures\ClientDeclarations\Shelf\ShelfResolver;
use Tests\Fixtures\ClientDeclarations\ShelfLayoutResolver;
use Tests\Support\UsesTemporaryFolder;
use Tests\TestCase;
use Throwable;

/**
 * The generated build files: one literal import per component under its domain's name, so two domains' Index.vue
 * never collide; folders outside app are included; a removed domain leaves the files on the next run; and every file
 * carries the same hash.
 */
final class ClientManifestTest extends TestCase
{
    use UsesTemporaryFolder;

    private const string LIBRARY_COMPONENT = "'library/Index': () => import('";

    private const string SHELF_COMPONENT = "'shelf/Index': () => import('";

    private const string LOGIN_COMPONENT = "'Login': () => import('../../../resources/js/pages/login/Login.vue')";

    /**
     * Every installed domain, since the manifest names each domain's types and pages.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    private const string READY_STATE = "| { status: 'ready'; data: T; offer?: WindowOfferData }";

    private const string SHARED_IMPORT = "import type { RecentNotesData } from './shared';";

    private const string LIBRARY_PAGE_PROPS = "export type LibraryIndexPageProps = {\n"
        .'    page: WindowResult<RecentNotesData>;';

    private const string SHELF_WINDOW = 'window_shelf_index?: WindowResult<RecentNotesData>;';

    private const string SHELF_ACCEPTS = 'export const accepts_shelf_index: '
        ."Accepts<{ data: RecentNotesData }, typeof import('";

    private const string PAGE_PROPS_IMPORT = "import type { RecentNotesData } from './types/page-props';";

    private const string SHELF_CHECK = "Shelf/Resources/js/pages/shelf/Index.vue').default> = true;";

    private const string LENT_WINDOW = 'window_shelf_lent?: WindowResult<DeclaredLayoutData>;';

    private const string CORE_IMPORT = "import type { DeclaredLayoutData } from './core';";

    private const string LOADER_IMPORT = "import type { ShelfRowsInput, ShelfRowsData } from './types/library';";

    private const string LOADER_DESCRIPTOR = 'export const libraryShelfRows: Loader<ShelfRowsInput, ShelfRowsData> = '
        ."{\n"
        ."    key: 'library.shelf-rows',\n"
        ."    prop: 'load_library_shelf_rows',\n"
        .'};';

    protected function setUp(): void
    {
        parent::setUp();

        $this->makeTemporaryFolder('ui-manifest');
        File::ensureDirectoryExists("{$this->root}/resources/js/pages/login");
        File::put("{$this->root}/resources/js/pages/login/Login.vue", '<template><div /></template>');
    }

    public function test_two_domains_index_components_get_distinct_literal_imports_from_outside_app(): void
    {
        $hash = $this->manifest([$this->library(), $this->shelf()])->write($this->root);
        $components = File::get("{$this->root}/resources/js/generated/ui-manifest.ts");

        $this->assertStringContainsString(self::LIBRARY_COMPONENT, $components);
        $this->assertStringContainsString(self::SHELF_COMPONENT, $components);
        $this->assertStringContainsString(
            self::LOGIN_COMPONENT,
            $components,
        );
        $this->assertStringContainsString(
            'tests/Fixtures/ClientDeclarations/Shelf/Resources/js/pages/shelf/Index.vue',
            $components,
        );

        foreach ([
            'resources/js/generated/ui-manifest.ts',
            'tsconfig.domains.json',
            'vite.domains.ts',
            'resources/css/generated/domain-sources.css',
        ] as $file) {
            $this->assertStringContainsString($hash, File::get("{$this->root}/{$file}"), $file);
        }

        $config = json_decode(File::get("{$this->root}/tsconfig.domains.json"), true);
        $this->assertArrayHasKey('@domain/shelf/*', $config['compilerOptions']['paths']);
        $this->assertContains('resources/js/**/*.vue', $config['include']);
        $this->assertSame(
            ['Login', 'library/Index', 'shelf/Index'],
            array_keys(require "{$this->root}/bootstrap/cache/ui-components.php"),
        );
        $this->assertSame([], glob("{$this->root}/**/*.tmp") ?: []);
    }

    public function test_a_generation_that_fails_midway_puts_every_file_it_replaced_back(): void
    {
        $this->manifest([$this->library(), $this->shelf()])->write($this->root);
        $before = File::get("{$this->root}/resources/js/generated/ui-manifest.ts");
        $next = $this->manifest([$this->library()]);
        $nextRoot = $this->root;
        $this->makeTemporaryFolder('ui-manifest-next');
        File::ensureDirectoryExists("{$this->root}/resources/js/pages/login");
        File::put("{$this->root}/resources/js/pages/login/Login.vue", '<template><div /></template>');
        $nextHash = $next->write($this->root);
        File::deleteDirectory($this->root);
        $this->root = $nextRoot;
        // The last file cannot be moved aside, so the generation fails after the others were already replaced.
        File::ensureDirectoryExists("{$this->root}/bootstrap/cache/ui-components.php.{$nextHash}.previous/blocked");

        try {
            $next->write($this->root);
            $this->fail('The generation was expected to fail.');
        } catch (Throwable) {
        }

        $this->assertSame($before, File::get("{$this->root}/resources/js/generated/ui-manifest.ts"));
        $this->assertSame([], File::glob("{$this->root}/resources/js/generated/*.tmp"));
    }

    public function test_a_removed_domain_leaves_the_generated_files_on_the_next_run(): void
    {
        $this->manifest([$this->library(), $this->shelf()])->write($this->root);
        $this->manifest([$this->library()])->write($this->root);

        $this->assertStringNotContainsString(
            'shelf/',
            File::get("{$this->root}/resources/js/generated/ui-manifest.ts"),
        );
        $this->assertStringNotContainsString('@domain/shelf', File::get("{$this->root}/vite.domains.ts"));
        $this->assertStringNotContainsString(
            'Shelf',
            File::get("{$this->root}/resources/css/generated/domain-sources.css"),
        );
    }

    public function test_each_page_gets_props_typed_with_its_readers_data_and_a_component_check(): void
    {
        $this->manifest([$this->library(), $this->shelf()])->write($this->root);
        $props = File::get("{$this->root}/resources/js/generated/types/page-props.ts");
        $checks = File::get("{$this->root}/resources/js/generated/ui-prop-checks.ts");

        $this->assertStringContainsString(self::READY_STATE, $props);
        $this->assertStringContainsString(self::SHARED_IMPORT, $props);
        $this->assertStringContainsString(
            self::LIBRARY_PAGE_PROPS,
            $props,
        );
        $this->assertStringContainsString(self::SHELF_WINDOW, $props);
        $this->assertStringContainsString(
            self::SHELF_ACCEPTS,
            $checks,
        );
        $this->assertStringContainsString(self::PAGE_PROPS_IMPORT, $checks);
        $this->assertStringContainsString(
            "'library/Index',",
            File::get("{$this->root}/resources/js/generated/ui-manifest.ts"),
        );
        $this->assertStringContainsString(self::SHELF_CHECK, $checks);
    }

    public function test_a_declared_layout_page_is_typed_with_the_layout_and_drawn_by_the_shared_renderer(): void
    {
        File::ensureDirectoryExists("{$this->root}/resources/js/pages/layout");
        File::put("{$this->root}/resources/js/pages/layout/DeclaredLayout.vue", '<template><div /></template>');
        $shelf = DomainEntry::fromClass(ShelfDomain::class)->declaring(pages: [
            Page::make('index', 'Shelf', Icon::Docs, ShelfResolver::class, 'Index.vue')->at(''),
            Page::layout('lent', 'Lent', Icon::Docs, ShelfLayoutResolver::class)->at('lent'),
        ]);
        $this->manifest([$this->library(), $shelf])->write($this->root);
        $props = File::get("{$this->root}/resources/js/generated/types/page-props.ts");

        $this->assertStringContainsString(self::LENT_WINDOW, $props);
        $this->assertStringContainsString(self::CORE_IMPORT, $props);
        $this->assertStringContainsString(
            "'layout/DeclaredLayout',",
            File::get("{$this->root}/resources/js/generated/ui-manifest.ts"),
        );
    }

    public function test_each_loader_gets_a_descriptor_typed_with_its_input_and_answer(): void
    {
        $library = DomainEntry::fromClass(LibraryDomain::class)->declaring(
            pages: [Page::make('index', 'Library', Icon::Docs, BooksResolver::class, 'Index.vue')->at('')],
            types: [ShelfRowsInput::class, ShelfRowsData::class],
            loaders: [Loader::make('shelf-rows', ShelfRowsLoader::class)],
        );
        $this->manifest([$library, $this->shelf()])->write($this->root);
        $loaders = File::get("{$this->root}/resources/js/generated/loaders.ts");

        $this->assertStringContainsString(self::LOADER_IMPORT, $loaders);
        $this->assertStringContainsString(self::LOADER_DESCRIPTOR, $loaders);
    }

    public function test_a_types_owner_is_core_its_domain_or_shared(): void
    {
        $owners = TypeOwners::of($this->app->make(DomainRegistry::class), $this->app->make(ClientDeclarations::class));

        $this->assertSame('core', $owners->ownerOf('App\\Support\\AssignmentData'));
        $this->assertSame('plans', $owners->ownerOf('Domain\\Plans\\Data\\AssignedPlanListData'));
        $this->assertSame('web', $owners->ownerOf('App\\Data\\Pages\\HomeData'));
        $this->assertSame('shared', $owners->ownerOf('Tests\\Fixtures\\ClientDeclarations\\RecentNotesData'));
    }

    /**
     * @param  list<DomainClient>  $domains
     */
    private function manifest(array $domains): ClientManifest
    {
        $declarations = ClientDeclarations::check($domains);

        return new ClientManifest(
            $declarations,
            $this->app->make('view'),
            new PagePropTypes(
                $declarations,
                TypeOwners::of($this->app->make(DomainRegistry::class), $declarations),
                $this->app->make(ReflectorFactory::class),
            ),
            new LoaderTypes($declarations, TypeOwners::of($this->app->make(DomainRegistry::class), $declarations)),
            $this->app->make(Files::class),
        );
    }

    private function library(): DomainClient
    {
        return DomainEntry::fromClass(LibraryDomain::class)->declaring(pages: [
            Page::make('index', 'Library', Icon::Docs, BooksResolver::class, 'Index.vue')->at(''),
        ]);
    }

    private function shelf(): DomainClient
    {
        return DomainEntry::fromClass(ShelfDomain::class)->declaring(pages: [
            Page::make('index', 'Shelf', Icon::Docs, ShelfResolver::class, 'Index.vue')->at(''),
        ]);
    }
}
