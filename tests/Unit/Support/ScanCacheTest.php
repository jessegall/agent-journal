<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\InterfacesDeclared;
use Tests\Support\ScanCache\ScanCache;

/**
 * The scan cache keeps each file's findings by its content: a second scan of unchanged files parses none of them and
 * finds the same, and a changed file is parsed again.
 */
final class ScanCacheTest extends TestCase
{
    public function test_unchanged_files_are_not_parsed_again_and_a_changed_one_is(): void
    {
        $run = bin2hex(random_bytes(4));
        $folder = sys_get_temp_dir()."/scan-cache-test-{$run}";
        mkdir($folder);
        $first = "{$folder}/First.php";
        $second = "{$folder}/Second.php";
        file_put_contents($first, <<<TEXT
            <?php
            // run {$run}
            namespace Cached;
            interface First {}

            TEXT);
        file_put_contents($second, <<<TEXT
            <?php
            // run {$run}
            namespace Cached;
            interface Second {}

            TEXT);
        $scan = new InterfacesDeclared();

        $before = ScanCache::parsedFiles();
        $found = ScanCache::findings($scan, [$first, $second]);
        $afterFirstScan = ScanCache::parsedFiles();
        $foundAgain = ScanCache::findings($scan, [$first, $second]);

        $this->assertSame(['Cached\\First', 'Cached\\Second'], $found);
        $this->assertSame($found, $foundAgain);
        $this->assertSame($afterFirstScan, ScanCache::parsedFiles());
        $this->assertSame(2, $afterFirstScan - $before);

        file_put_contents($second, <<<TEXT
            <?php
            // run {$run}
            namespace Cached;
            interface Changed {}

            TEXT);

        $this->assertSame(['Cached\\First', 'Cached\\Changed'], ScanCache::findings($scan, [$first, $second]));
        $this->assertSame($afterFirstScan + 1, ScanCache::parsedFiles());

        array_map(unlink(...), [$first, $second]);
        rmdir($folder);
    }
}
