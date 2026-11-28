<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use Illuminate\Support\Str;
use Tests\Architecture\Support\ParsedFile;
use Tests\Support\ScanCache\FileScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\TestCase;

/**
 * The scan cache reads a file again whenever its content changed, also when it was rewritten within the same second
 * at the same size, and reads an unchanged file from the cache.
 */
final class ScanCacheTest extends TestCase
{
    private string $folder;

    private string $key;

    protected function setUp(): void
    {
        parent::setUp();

        $this->key = 'scan-cache-test-'.Str::random(8);
        $this->folder = storage_path("framework/testing/{$this->key}");
        mkdir($this->folder, 0777, true);
    }

    protected function tearDown(): void
    {
        $cacheFiles = glob(storage_path("framework/testing/scan-cache/{$this->key}*")) ?: [];
        array_map(unlink(...), [...glob("{$this->folder}/*") ?: [], ...$cacheFiles]);
        rmdir($this->folder);

        parent::tearDown();
    }

    public function test_a_file_rewritten_in_the_same_second_at_the_same_size_is_read_again(): void
    {
        $path = "{$this->folder}/note.php";

        file_put_contents($path, '<?php // one');
        $first = ScanCache::findings($this->scan(), [$path]);
        file_put_contents($path, '<?php // two');
        $second = ScanCache::findings($this->scan(), [$path]);

        $this->assertSame([['// one'], ['// two']], [$first, $second]);
    }

    public function test_a_generated_file_is_never_judged(): void
    {
        $path = base_path('app/Hosts/Protocol/HostRefusal.php');

        $this->assertSame([], ScanCache::findings($this->scan(), [$path]));
    }

    public function test_an_unchanged_file_is_not_parsed_again(): void
    {
        $path = "{$this->folder}/note.php";
        file_put_contents($path, '<?php // one');
        ScanCache::findings($this->scan(), [$path]);
        $parsedBefore = ScanCache::parsedFiles();

        $this->assertSame(['// one'], ScanCache::findings($this->scan(), [$path]));
        $this->assertSame($parsedBefore, ScanCache::parsedFiles());
    }

    public function test_a_narrow_scan_loads_its_own_cache_entry(): void
    {
        $first = "{$this->folder}/first.php";
        $second = "{$this->folder}/second.php";
        file_put_contents($first, '<?php // one');
        file_put_contents($second, '<?php // two');

        ScanCache::findings($this->scan(), [$first, $second]);
        ScanCache::findings($this->scan(), [$first]);
        ScanCache::forget();

        $entries = glob(storage_path("framework/testing/scan-cache/{$this->key}*"));

        $this->assertCount(2, $entries);
        $this->assertSame(['// one'], ScanCache::findings($this->scan(), [$first]));
    }

    /**
     * A scan whose one finding is the file's code after its opening tag.
     *
     * @return FileScan<string>
     */
    private function scan(): FileScan
    {
        return new readonly class($this->key) implements FileScan
        {
            public function __construct(private string $key) {}

            public function key(): string
            {
                return $this->key;
            }

            public function findingsIn(ParsedFile $file): array
            {
                return [trim(substr($file->code, strlen('<?php')))];
            }
        };
    }
}
