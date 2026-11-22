<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Support\Types\HiddenAwareDataTransformer;
use Illuminate\Filesystem\Filesystem;
use Spatie\TypeScriptTransformer\Transformers\EnumTransformer;
use Spatie\TypeScriptTransformer\TypeScriptTransformer;
use Spatie\TypeScriptTransformer\TypeScriptTransformerConfigFactory;
use Spatie\TypeScriptTransformer\Writers\FlatModuleWriter;
use Tests\Fixtures\Web\Types\ShelfPage;
use Tests\TestCase;

/**
 * The generated TypeScript and the JSON a page sends agree: computed values and nested types are there, hidden seeds
 * and services are on neither, and a missing optional value is optional.
 */
final class BrowserContractTest extends TestCase
{
    private const string STATE_TYPE = "export type ShelfState = 'open' | 'closed';";

    private const string BOOKS_FIELD = 'readonly books: BookData[]';

    private const string STATE_FIELD = 'readonly state: ShelfState';

    private const string NOTE_FIELD = 'readonly note?: string';

    private const string COUNT_FIELD = 'bookCount: number';

    private string $output;

    protected function setUp(): void
    {
        parent::setUp();

        $this->output = sys_get_temp_dir().'/browser-contract-'.getmypid();
        new Filesystem()->ensureDirectoryExists($this->output);
    }

    protected function tearDown(): void
    {
        new Filesystem()->deleteDirectory($this->output);

        parent::tearDown();
    }

    public function test_the_generated_types_describe_the_page_and_hide_its_seed_and_service(): void
    {
        TypeScriptTransformer::create(TypeScriptTransformerConfigFactory::create()
            ->transformer(new HiddenAwareDataTransformer(), EnumTransformer::class)
            ->transformDirectories(base_path('tests/Fixtures/Web/Types'))
            ->outputDirectory($this->output)
            ->writer(new FlatModuleWriter('index.ts')))->execute();

        $types = (string) file_get_contents("{$this->output}/index.ts");

        $this->assertStringContainsString(self::STATE_TYPE, $types);
        $this->assertStringContainsString(self::BOOKS_FIELD, $types);
        $this->assertStringContainsString(self::STATE_FIELD, $types);
        $this->assertStringContainsString(self::NOTE_FIELD, $types);
        $this->assertStringContainsString(self::COUNT_FIELD, $types);
        $this->assertStringNotContainsString('shelf:', $types);
        $this->assertStringNotContainsString('counter', $types);
        $this->assertStringNotContainsString('ShelfCounter', $types);
    }

    public function test_the_json_carries_the_computed_value_and_not_the_hidden_seed_or_service(): void
    {
        $page = ShelfPage::from(['shelf' => 'poetry', 'books' => [['title' => 'Odes']], 'state' => 'open']);

        $this->assertSame(['bookCount' => 6, 'books' => [['title' => 'Odes']], 'state' => 'open'], $page->toArray());
    }
}
