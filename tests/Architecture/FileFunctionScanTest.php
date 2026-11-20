<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\FileFunctionScan;
use Tests\Architecture\Support\ParsedFile;

/**
 * The scan finds every form of direct file access, each with the Files method to use instead, and leaves alone the
 * method calls, streams and classes that only look like file access.
 */
final class FileFunctionScanTest extends TestCase
{
    public function test_every_banned_form_is_found_and_every_look_alike_left_alone(): void
    {
        $findings = FileFunctionScan::of(ParsedFile::fromPath(dirname(__DIR__).'/Fixtures/FileAccess/DirectFileAccess.php'));

        $this->assertSame(
            [
                [21, 'Illuminate\Filesystem\Filesystem'],
                [25, 'file_get_contents()'],
                [26, 'file_put_contents()'],
                [27, 'fopen()'],
                [28, 'is_dir()'],
                [29, 'glob()'],
                [30, 'hash_file()'],
                [31, 'new RecursiveDirectoryIterator'],
                [32, 'new FilesystemIterator'],
                [33, 'Symfony\Component\Finder\Finder'],
                [34, 'Illuminate\Support\Facades\File'],
            ],
            array_map(fn (array $finding) => [$finding['line'], $finding['form']], $findings),
        );
    }

    public function test_each_finding_names_the_files_method_to_use_instead(): void
    {
        $findings = FileFunctionScan::of(ParsedFile::fromPath(dirname(__DIR__).'/Fixtures/FileAccess/DirectFileAccess.php'));
        $instead = array_column($findings, 'instead', 'form');

        $this->assertSame('Files::read', $instead['file_get_contents()']);
        $this->assertSame('Files::list or Files::matching', $instead['glob()']);
        $this->assertSame('Files::digest', $instead['hash_file()']);
        $this->assertSame('Files', $instead['Illuminate\Filesystem\Filesystem']);
    }
}
