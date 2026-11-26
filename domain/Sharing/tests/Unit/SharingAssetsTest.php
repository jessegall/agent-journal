<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Unit;

use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Values\FilePath;
use Carbon\CarbonImmutable;
use Domain\Sharing\Http\Responses\SharingAssets;
use Domain\Sharing\Tests\TestCase;
use Tests\Support\Files\UsesTemporaryPlaces;

/**
 * The share reader's manifest is read through the funnel: once while it is unchanged, again after a build rewrote it,
 * with no restart, and as no files before the reader was built.
 */
final class SharingAssetsTest extends TestCase
{
    use UsesTemporaryPlaces;

    private string $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->project = $this->placeInTemporaryFolder(Place::Project);
        mkdir("{$this->project}/public/".SharingAssets::FOLDER, 0o755, true);
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addMinute());
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    public function test_an_unchanged_manifest_is_read_once_and_a_rebuilt_one_is_seen_at_once(): void
    {
        $this->build('assets/reader-1.css');
        $assets = $this->app->make(SharingAssets::class);

        $this->assertTrue($assets->lists('assets/reader-1.css'));
        $this->assertSame('assets/reader-1.css', $assets->stylesheet());
        $this->assertSame(1, $this->app->make(Files::class)->readCount($this->manifest()));

        $this->build('assets/reader-two.css');

        $this->assertTrue($assets->lists('assets/reader-two.css'));
        $this->assertFalse($assets->lists('assets/reader-1.css'));
    }

    public function test_before_the_reader_was_built_no_file_is_listed(): void
    {
        $assets = $this->app->make(SharingAssets::class);

        $this->assertFalse($assets->lists('assets/reader-1.css'));
        $this->assertNull($assets->stylesheet());
    }

    private function build(string $stylesheet): void
    {
        file_put_contents(
            "{$this->project}/public/".SharingAssets::FOLDER.'/manifest.json',
            json_encode(['resources/css/sharing.css' => ['file' => $stylesheet]], JSON_THROW_ON_ERROR),
        );
    }

    private function manifest(): FilePath
    {
        return FilePath::in(Place::Project, 'public/'.SharingAssets::FOLDER.'/manifest.json');
    }
}
