<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;
use Tests\Architecture\Support\DocblockScan;
use Tests\Architecture\Support\NameScan;
use Tests\Architecture\Support\ParsedFile;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\StringScan;

/**
 * Proves the scans survive real code; what the checker permits is proven elsewhere.
 */
final class ScanSmokeTest extends TestCase
{
    /**
     * @return iterable<string, array{string}>
     */
    public static function folders(): iterable
    {
        yield 'the application' => ['app'];
        yield 'Laravel support' => ['vendor/laravel/framework/src/Illuminate/Support'];
        yield 'Eloquent' => ['vendor/laravel/framework/src/Illuminate/Database/Eloquent'];
    }

    #[DataProvider('folders')]
    public function test_every_scan_reads_every_file(string $folder): void
    {
        $root = dirname(__DIR__, 2);
        $roots = ProjectRoots::fromComposer("{$root}/composer.json");
        $count = 0;

        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator("{$root}/{$folder}")) as $entry) {
            if (! $entry instanceof SplFileInfo || $entry->getExtension() !== 'php') {
                continue;
            }

            $file = ParsedFile::fromPath($entry->getPathname());
            NameScan::of($file);
            DocblockScan::of($file);
            StringScan::of($file, $roots);
            $count++;
        }

        $this->assertGreaterThan(0, $count);
    }
}
