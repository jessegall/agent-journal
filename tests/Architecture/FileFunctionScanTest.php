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
                [23, 'Illuminate\Filesystem\Filesystem'],
                [31, 'file_get_contents()'],
                [32, 'file_put_contents()'],
                [33, 'fopen()'],
                [34, 'is_dir()'],
                [35, 'glob()'],
                [36, 'hash_file()'],
                [37, 'new RecursiveDirectoryIterator'],
                [38, 'new FilesystemIterator'],
                [39, 'Symfony\Component\Finder\Finder'],
                [40, 'Illuminate\Support\Facades\File'],
                [70, 'file_get_contents()'],
            ],
            array_map(fn (array $finding) => [$finding['line'], $finding['form']], $findings),
        );
    }

    public function test_a_site_in_a_method_marked_outside_the_places_carries_its_exemption(): void
    {
        $findings = FileFunctionScan::of(ParsedFile::fromPath(dirname(__DIR__).'/Fixtures/FileAccess/DirectFileAccess.php'));
        $exemptions = array_column($findings, 'exemption', 'line');

        $this->assertSame('UserNamedFile', $exemptions[70]);
        $this->assertNull($exemptions[31]);
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
