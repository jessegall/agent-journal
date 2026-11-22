<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Domains\Support\DomainEntry;
use App\Domains\Support\DomainRegistry;
use App\Files\Contracts\Files;
use App\Reflection\Contracts\ReflectorFactory;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;
use App\Ui\Support\UiDeclarations;
use App\Web\Support\UiManifest;
use App\Web\Types\PagePropTypes;
use App\Web\Types\TypeOwners;
use Illuminate\Support\Facades\File;
use Tests\Fixtures\UiDeclarations\Library\BooksResolver;
use Tests\Fixtures\UiDeclarations\Library\LibraryDomain;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfDomain;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfResolver;
use Tests\Fixtures\UiDeclarations\ShelfLayoutResolver;
use Tests\Support\UsesTemporaryFolder;
use Tests\TestCase;
use Throwable;

/**
 * The generated build files: one literal import per component under its domain's name, so two domains' Index.vue
 * never collide; folders outside app are included; a removed domain leaves the files on the next run; and every file
 * carries the same hash.
 */
final class UiManifestTest extends TestCase
{
    use UsesTemporaryFolder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->makeTemporaryFolder('ui-manifest');
        File::ensureDirectoryExists("{$this->root}/resources/js/pages");
        File::put("{$this->root}/resources/js/pages/Login.vue", '<template><div /></template>');
    }

    public function test_two_domains_index_components_get_distinct_literal_imports_from_outside_app(): void
    {
        $hash = $this->manifest([$this->library(), $this->shelf()])->write($this->root);
        $components = File::get("{$this->root}/resources/js/generated/ui-manifest.ts");

        $this->assertStringContainsString("'library/Index': () => import('", $components);
        $this->assertStringContainsString("'shelf/Index': () => import('", $components);
        $this->assertStringContainsString(
            "'Login': () => import('../../../resources/js/pages/Login.vue')",
            $components,
        );
        $this->assertStringContainsString('tests/Fixtures/UiDeclarations/Shelf/Resources/js/Index.vue', $components);

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
        File::ensureDirectoryExists("{$this->root}/resources/js/pages");
        File::put("{$this->root}/resources/js/pages/Login.vue", '<template><div /></template>');
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

        $this->assertStringContainsString("| { state: 'ready'; data: T; dockOffer?: DockOfferData }", $props);
        $this->assertStringContainsString("import type { RecentNotesData } from './shared';", $props);
        $this->assertStringContainsString(
            "export type LibraryIndexPageProps = {\n    page: WindowResult<RecentNotesData>;",
            $props,
        );
        $this->assertStringContainsString('window_shelf_index?: WindowResult<RecentNotesData>;', $props);
        $this->assertStringContainsString(
            "export const accepts_shelf_index: Accepts<{ data: RecentNotesData }, typeof import('",
            $checks,
        );
        $this->assertStringContainsString("import type { RecentNotesData } from './types/page-props';", $checks);
        $this->assertStringContainsString(
            "'library/Index',",
            File::get("{$this->root}/resources/js/generated/ui-manifest.ts"),
        );
        $this->assertStringContainsString("Shelf/Resources/js/Index.vue').default> = true;", $checks);
    }

    public function test_a_declared_layout_page_is_typed_with_the_layout_and_drawn_by_the_shared_renderer(): void
    {
        File::ensureDirectoryExists("{$this->root}/resources/js/components/layout");
        File::put("{$this->root}/resources/js/components/layout/DeclaredLayout.vue", '<template><div /></template>');
        $shelf = DomainEntry::fromClass(ShelfDomain::class)->declaring(pages: [
            Page::make('index', 'Shelf', Icon::Docs, ShelfResolver::class, 'Index.vue')->at(''),
            Page::layout('lent', 'Lent', Icon::Docs, ShelfLayoutResolver::class)->at('lent'),
        ]);
        $this->manifest([$this->library(), $shelf])->write($this->root);
        $props = File::get("{$this->root}/resources/js/generated/types/page-props.ts");

        $this->assertStringContainsString('window_shelf_lent?: WindowResult<DeclaredLayoutData>;', $props);
        $this->assertStringContainsString("import type { DeclaredLayoutData } from './core';", $props);
        $this->assertStringContainsString(
            "'layout/DeclaredLayout',",
            File::get("{$this->root}/resources/js/generated/ui-manifest.ts"),
        );
    }

    public function test_a_types_owner_is_core_its_domain_or_shared(): void
    {
        $owners = TypeOwners::of($this->app->make(DomainRegistry::class), $this->app->make(UiDeclarations::class));

        $this->assertSame('core', $owners->ownerOf('App\\Assignments\\Support\\AssignmentData'));
        $this->assertSame('plans', $owners->ownerOf('Domain\\Plans\\Http\\Data\\AssignedPlanListData'));
        $this->assertSame('web', $owners->ownerOf('App\\Web\\Data\\HomeData'));
        $this->assertSame('shared', $owners->ownerOf('Tests\\Fixtures\\UiDeclarations\\RecentNotesData'));
    }

    /**
     * @param  list<DomainUi>  $domains
     */
    private function manifest(array $domains): UiManifest
    {
        $declarations = UiDeclarations::check($domains);

        return new UiManifest(
            $declarations,
            $this->app->make('view'),
            new PagePropTypes(
                $declarations,
                TypeOwners::of($this->app->make(DomainRegistry::class), $declarations),
                $this->app->make(ReflectorFactory::class),
            ),
            $this->app->make(Files::class),
        );
    }

    private function library(): DomainUi
    {
        return DomainEntry::fromClass(LibraryDomain::class)->declaring(pages: [
            Page::make('index', 'Library', Icon::Docs, BooksResolver::class, 'Index.vue')->at(''),
        ]);
    }

    private function shelf(): DomainUi
    {
        return DomainEntry::fromClass(ShelfDomain::class)->declaring(pages: [
            Page::make('index', 'Shelf', Icon::Docs, ShelfResolver::class, 'Index.vue')->at(''),
        ]);
    }
}
