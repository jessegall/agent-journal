<?php

declare(strict_types=1);

namespace Tests\Unit\Web;

use Illuminate\Filesystem\Filesystem;
use Tests\Fixtures\Web\Types\ShelfPage;
use Tests\TestCase;

/**
 * The generated TypeScript and the JSON a page sends agree: computed values and nested types are there, hidden seeds
 * and services are on neither, and a missing optional value is optional.
 */
final class BrowserContractTest extends TestCase
{
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

    public function test_the_json_carries_the_computed_value_and_not_the_hidden_seed_or_service(): void
    {
        $page = ShelfPage::from(['shelf' => 'poetry', 'books' => [['title' => 'Odes']], 'state' => 'open']);

        $this->assertSame(['bookCount' => 6, 'books' => [['title' => 'Odes']], 'state' => 'open'], $page->toArray());
    }
}
