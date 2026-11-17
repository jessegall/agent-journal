<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Domain\Declarations\DomainUi;
use App\Domain\Declarations\Page;
use App\Domain\DomainEntry;
use App\Domain\Enums\Icon;
use App\Domain\UiDeclarations;
use App\Domain\Web\Support\UiManifest;
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

    /**
     * @param  list<DomainUi>  $domains
     */
    private function manifest(array $domains): UiManifest
    {
        return new UiManifest(UiDeclarations::check($domains), $this->app->make('view'));
    }

    private function library(): DomainUi
    {
        return DomainUi::declaring(DomainEntry::fromClass(LibraryDomain::class), pages: [
            Page::make('index', 'Library', Icon::Docs, BooksReader::class, 'Index.vue')->at(''),
        ]);
    }

    private function shelf(): DomainUi
    {
        return DomainUi::declaring(DomainEntry::fromClass(ShelfDomain::class), pages: [
            Page::make('index', 'Shelf', Icon::Docs, ShelfReader::class, 'Index.vue')->at(''),
        ]);
    }
}
