<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Core\Ui\Declarations\DomainUi;
use App\Core\Ui\Declarations\Page;
use App\Core\Ui\Enums\Icon;
use App\Core\Ui\Support\UiDeclarations;
use App\Core\Web\Support\UiManifest;
use App\Core\Web\Types\PagePropTypes;
use App\Core\Web\Types\TypeOwners;
use App\Domain\DomainEntry;
use App\Domain\DomainRegistry;
use Illuminate\Support\Facades\File;
use Tests\Fixtures\UiDeclarations\Library\BooksReader;
use Tests\Fixtures\UiDeclarations\Library\LibraryDomain;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfDomain;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfReader;
use Tests\TestCase;

/**
 * The generated build files: one literal import per component under its domain's name, so two domains' Index.vue
 * never collide; folders outside app are included; a removed domain leaves the files on the next run; and every file
 * carries the same hash.
 */
final class UiManifestTest extends TestCase
{
    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->root = sys_get_temp_dir().'/ui-manifest-'.getmypid();
        File::ensureDirectoryExists("{$this->root}/resources/js/pages");
        File::put("{$this->root}/resources/js/pages/Login.vue", '<template><div /></template>');
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);

        parent::tearDown();
    }

    public function test_two_domains_index_components_get_distinct_literal_imports_from_outside_app(): void
    {
        $hash = $this->manifest([$this->library(), $this->shelf()])->write($this->root);
        $components = File::get("{$this->root}/resources/js/generated/ui-manifest.ts");

        $this->assertStringContainsString("'library/Index': () => import('", $components);
        $this->assertStringContainsString("'shelf/Index': () => import('", $components);
        $this->assertStringContainsString("'Login': () => import('../../../resources/js/pages/Login.vue')", $components);
        $this->assertStringContainsString('tests/Fixtures/UiDeclarations/Shelf/Resources/js/Index.vue', $components);

        foreach (['resources/js/generated/ui-manifest.ts', 'tsconfig.domains.json', 'vite.domains.ts', 'resources/css/generated/domain-sources.css'] as $file) {
            $this->assertStringContainsString($hash, File::get("{$this->root}/{$file}"), $file);
        }

        $config = json_decode(File::get("{$this->root}/tsconfig.domains.json"), true);
        $this->assertArrayHasKey('@domain/shelf/*', $config['compilerOptions']['paths']);
        $this->assertContains('resources/js/**/*.vue', $config['include']);
        $this->assertSame(['Login', 'library/Index', 'shelf/Index'], array_keys(require "{$this->root}/bootstrap/cache/ui-components.php"));
        $this->assertSame([], glob("{$this->root}/**/*.tmp") ?: []);
    }

    public function test_a_removed_domain_leaves_the_generated_files_on_the_next_run(): void
    {
        $this->manifest([$this->library(), $this->shelf()])->write($this->root);
        $this->manifest([$this->library()])->write($this->root);

        $this->assertStringNotContainsString('shelf/', File::get("{$this->root}/resources/js/generated/ui-manifest.ts"));
        $this->assertStringNotContainsString('@domain/shelf', File::get("{$this->root}/vite.domains.ts"));
        $this->assertStringNotContainsString('Shelf', File::get("{$this->root}/resources/css/generated/domain-sources.css"));
    }

    public function test_each_page_gets_props_typed_with_its_readers_data_and_a_component_check(): void
    {
        $this->manifest([$this->library(), $this->shelf()])->write($this->root);
        $props = File::get("{$this->root}/resources/js/generated/types/page-props.ts");
        $checks = File::get("{$this->root}/resources/js/generated/ui-prop-checks.ts");

        $this->assertStringContainsString("export type WindowResult<T> = { state: 'ready'; data: T }", $props);
        $this->assertStringContainsString("import type { RecentNotesData } from './shared';", $props);
        $this->assertStringContainsString("export type LibraryIndexPageProps = {\n    page: WindowResult<RecentNotesData>;", $props);
        $this->assertStringContainsString('window_shelf_index?: WindowResult<RecentNotesData>;', $props);
        $this->assertStringContainsString("export const accepts_shelf_index: Accepts<{ data: RecentNotesData }, typeof import('", $checks);
        $this->assertStringContainsString("import type { RecentNotesData } from './types/page-props';", $checks);
        $this->assertStringContainsString("'library/Index',", File::get("{$this->root}/resources/js/generated/ui-manifest.ts"));
        $this->assertStringContainsString("Shelf/Resources/js/Index.vue').default> = true;", $checks);
    }

    public function test_a_types_owner_is_core_its_domain_or_shared(): void
    {
        $owners = TypeOwners::of($this->app->make(DomainRegistry::class), $this->app->make(UiDeclarations::class));

        $this->assertSame('core', $owners->ownerOf('App\\Core\\Assignments\\Support\\AssignmentData'));
        $this->assertSame('plans', $owners->ownerOf('App\\Domain\\Plans\\Http\\Data\\AssignedPlanListData'));
        $this->assertSame('web', $owners->ownerOf('App\\Core\\Web\\Data\\HomeData'));
        $this->assertSame('shared', $owners->ownerOf('Tests\\Fixtures\\UiDeclarations\\RecentNotesData'));
    }

    /**
     * @param  list<DomainUi>  $domains
     */
    private function manifest(array $domains): UiManifest
    {
        $declarations = UiDeclarations::check($domains);

        return new UiManifest($declarations, $this->app->make('view'), new PagePropTypes($declarations, TypeOwners::of($this->app->make(DomainRegistry::class), $declarations)));
    }

    private function library(): DomainUi
    {
        return DomainEntry::fromClass(LibraryDomain::class)->declaring(pages: [
            Page::make('index', 'Library', Icon::Docs, BooksReader::class, 'Index.vue')->at(''),
        ]);
    }

    private function shelf(): DomainUi
    {
        return DomainEntry::fromClass(ShelfDomain::class)->declaring(pages: [
            Page::make('index', 'Shelf', Icon::Docs, ShelfReader::class, 'Index.vue')->at(''),
        ]);
    }
}
